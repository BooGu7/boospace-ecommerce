import type {
  BlogPost,
  Brand,
  Category,
  CmsPage,
  Order,
  PaginatedResult,
  PaginationParams,
  Product,
  ProductFilters,
  ProductRepository,
  SortOption,
} from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type JsonRow<T> = {
  id: string;
  slug?: string;
  data: T;
};

function paginate<T>(
  items: T[],
  pagination?: PaginationParams,
): PaginatedResult<T> {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 12;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  return {
    items: items.slice(offset, offset + limit),
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

async function listJsonData<T>(
  table: string,
  orderColumn = "sort_order",
): Promise<T[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("id, slug, data")
    .order(orderColumn, { ascending: true });

  if (error) {
    throw new Error(`Failed to load ${table}: ${error.message}`);
  }

  return ((data ?? []) as JsonRow<T>[]).map((row) => row.data);
}

async function getJsonDataBySlug<T>(
  table: string,
  slug: string,
): Promise<T | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("data")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load ${table} by slug: ${error.message}`);
  }

  return (data as Pick<JsonRow<T>, "data"> | null)?.data ?? null;
}

async function getJsonDataById<T>(
  table: string,
  id: string,
): Promise<T | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("data")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load ${table} by id: ${error.message}`);
  }

  return (data as Pick<JsonRow<T>, "data"> | null)?.data ?? null;
}

function applyProductFilters(
  items: Product[],
  categories: Category[],
  filters?: ProductFilters,
): Product[] {
  if (!filters) return items.filter((product) => product.status === "active");

  let result = items.filter((product) => product.status === "active");

  if (filters.category) {
    const category = categories.find((item) => item.slug === filters.category);
    if (category) {
      result = result.filter((product) =>
        product.categoryIds.includes(category.id),
      );
    }
  }

  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    result = result.filter((product) => {
      const price = product.variants[0]?.price ?? 0;
      if (min !== undefined && price < min) return false;
      if (max !== undefined && price > max) return false;
      return true;
    });
  }

  if (filters.inStock !== undefined) {
    result = result.filter((product) =>
      product.variants.some((variant) =>
        filters.inStock
          ? variant.inventory.quantity > 0 || variant.inventory.allowBackorder
          : true,
      ),
    );
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    result = result.filter((product) =>
      filters.tags!.some((tag) => product.tags.includes(tag)),
    );
  }

  return result;
}

function applyProductSort(items: Product[], sort?: SortOption): Product[] {
  if (!sort) return items;

  return [...items].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case "price":
        comparison = (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0);
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }

    return sort.order === "desc" ? -comparison : comparison;
  });
}

export const supabaseCategoryRepository = {
  async list(): Promise<Category[]> {
    return listJsonData<Category>("categories");
  },

  async getBySlug(slug: string): Promise<Category | null> {
    return getJsonDataBySlug<Category>("categories", slug);
  },

  async getById(id: string): Promise<Category | null> {
    return getJsonDataById<Category>("categories", id);
  },

  async getChildren(parentId: string): Promise<Category[]> {
    const categories = await this.list();
    return categories
      .filter((category) => category.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  },

  async getTopLevel(): Promise<Category[]> {
    const categories = await this.list();
    return categories
      .filter((category) => !category.parentId)
      .sort((a, b) => a.order - b.order);
  },

  async getAncestors(categoryId: string): Promise<Category[]> {
    const categories = await this.list();
    const chain: Category[] = [];
    let current = categories.find((category) => category.id === categoryId);

    while (current) {
      chain.unshift(current);
      current = current.parentId
        ? categories.find((category) => category.id === current!.parentId)
        : undefined;
    }

    return chain;
  },
};

export const supabaseProductRepository: ProductRepository = {
  async list(filters, sort, pagination) {
    const [products, categories] = await Promise.all([
      listJsonData<Product>("products", "created_at"),
      supabaseCategoryRepository.list(),
    ]);
    const filtered = applyProductFilters(products, categories, filters);
    return paginate(applyProductSort(filtered, sort), pagination);
  },

  async getBySlug(slug) {
    const product = await getJsonDataBySlug<Product>("products", slug);
    return product?.status === "active" ? product : null;
  },

  async getById(id) {
    return getJsonDataById<Product>("products", id);
  },

  async getFeatured(limit = 4) {
    const products = await listJsonData<Product>("products", "created_at");
    return products
      .filter((product) => product.featured && product.status === "active")
      .slice(0, limit);
  },

  async getByCategory(categorySlug, pagination) {
    const [products, category] = await Promise.all([
      listJsonData<Product>("products", "created_at"),
      supabaseCategoryRepository.getBySlug(categorySlug),
    ]);

    if (!category) return paginate([], pagination);

    return paginate(
      products.filter(
        (product) =>
          product.status === "active" &&
          product.categoryIds.includes(category.id),
      ),
      pagination,
    );
  },

  async search(query, pagination) {
    const [products, categories] = await Promise.all([
      listJsonData<Product>("products", "created_at"),
      supabaseCategoryRepository.list(),
    ]);
    return paginate(
      applyProductFilters(products, categories, { search: query }),
      pagination,
    );
  },
};

export const supabaseBrandRepository = {
  async list(): Promise<Brand[]> {
    return listJsonData<Brand>("brands");
  },

  async getBySlug(slug: string): Promise<Brand | null> {
    return getJsonDataBySlug<Brand>("brands", slug);
  },

  async getById(id: string): Promise<Brand | null> {
    return getJsonDataById<Brand>("brands", id);
  },
};

export const supabasePageRepository = {
  async list(): Promise<CmsPage[]> {
    const pages = await listJsonData<CmsPage>(
      "ecommerce_pages",
      "published_at",
    );
    return pages.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  },

  async getBySlug(slug: string): Promise<CmsPage | null> {
    return getJsonDataBySlug<CmsPage>("ecommerce_pages", slug);
  },

  async getById(id: string): Promise<CmsPage | null> {
    return getJsonDataById<CmsPage>("ecommerce_pages", id);
  },
};

export const supabaseBlogRepository = {
  async list(params?: PaginationParams): Promise<PaginatedResult<BlogPost>> {
    const posts = await listJsonData<BlogPost>(
      "ecommerce_blog_posts",
      "published_at",
    );
    const sorted = posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    return paginate(sorted, params);
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    return getJsonDataBySlug<BlogPost>("ecommerce_blog_posts", slug);
  },

  async getByTag(
    tag: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<BlogPost>> {
    const posts = await listJsonData<BlogPost>("ecommerce_blog_posts");
    return paginate(
      posts.filter((post) => post.tags.includes(tag)),
      params,
    );
  },
};

export async function createSupabaseOrder(order: Order): Promise<Order> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      id: order.id,
      order_number: order.orderNumber,
      customer_email: order.customerEmail,
      status: order.status,
      payment_status: order.paymentStatus,
      total: order.total,
      data: order,
    })
    .select("data")
    .single();

  if (error) {
    console.error("SUPABASE ORDER ERROR:", error);

    throw new Error(`Failed to create order: ${error.message}`);
  }

  return (data as { data: Order }).data;
}
