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

/**
 * =========================================================================
 * PHÂN TRANG (HELPER)
 * =========================================================================
 */
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

/**
 * =========================================================================
 * BỘ CHUYỂN ĐỔI DỮ LIỆU (ADAPTERS)
 * Ánh xạ dữ liệu quan hệ Supabase thành Interface mà UI Storefront mong đợi
 * =========================================================================
 */
function mapDbProductToStorefront(dbProduct: any): Product {
  if (!dbProduct) return null as any;
  const price = Number(dbProduct.price ?? 0);

  // Tạo cấu trúc variants/inventory tương thích với frontend của storefront
  const defaultVariant = {
    id: dbProduct.id + "-default",
    name: "Default Variant",
    sku: dbProduct.sku || "",
    price: price,
    compareAtPrice: dbProduct.compare_price
      ? Number(dbProduct.compare_price)
      : null,
    inventory: {
      quantity: dbProduct.stock ?? 99,
      allowBackorder: true,
    },
  };

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description || "",
    shortDescription: dbProduct.short_description || "",
    status: dbProduct.published ? "active" : "draft",
    featured: dbProduct.featured || false,
    images: dbProduct.images || [],
    categoryIds: dbProduct.category_id ? [dbProduct.category_id] : [],
    brandId: dbProduct.brand_id,
    tags: [],
    variants: [defaultVariant],
    createdAt: dbProduct.created_at || new Date().toISOString(),
    updatedAt: dbProduct.updated_at || new Date().toISOString(),
  } as unknown as Product;
}

function mapDbCategoryToStorefront(dbCategory: any): Category {
  if (!dbCategory) return null as any;
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    parentId: dbCategory.parent_id || null,
    order: dbCategory.sort_order ?? 0,
    createdAt: dbCategory.created_at,
    updatedAt: dbCategory.updated_at,
  } as unknown as Category;
}

function mapDbBrandToStorefront(dbBrand: any): Brand {
  if (!dbBrand) return null as any;
  return {
    id: dbBrand.id,
    name: dbBrand.name,
    slug: dbBrand.slug,
    logoUrl: dbBrand.logo_url || null,
    createdAt: dbBrand.created_at,
    updatedAt: dbBrand.updated_at,
  } as unknown as Brand;
}

/**
 * =========================================================================
 * BỘ GIAO DIỆN JSON CHO BLOG & PAGES (Giữ nguyên cấu trúc JSONB mặc định)
 * =========================================================================
 */
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

/**
 * =========================================================================
 * LOGIC LỌC SẢN PHẨM Ở CLIENT (Giữ nguyên của template)
 * =========================================================================
 */
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
        product.description.toLowerCase().includes(query),
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

/**
 * =========================================================================
 * EXPORTS CHUẨN ĐỒNG BỘ ĐẦY ĐỦ CHO TOÀN DỰ ÁN
 * =========================================================================
 */

export const supabaseCategoryRepository = {
  async list(): Promise<Category[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return (data || []).map(mapDbCategoryToStorefront);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return null;
    return mapDbCategoryToStorefront(data);
  },

  async getById(id: string): Promise<Category | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return null;
    return mapDbCategoryToStorefront(data);
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
    const supabase = createSupabaseServerClient();
    const [dbProductsRes, categories] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
      supabaseCategoryRepository.list(),
    ]);

    const products = (dbProductsRes.data || []).map(mapDbProductToStorefront);
    const filtered = applyProductFilters(products, categories, filters);
    return paginate(applyProductSort(filtered, sort), pagination);
  },

  async getBySlug(slug) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;
    const product = mapDbProductToStorefront(data);
    return product?.status === "active" ? product : null;
  },

  async getById(id) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return null;
    return mapDbProductToStorefront(data);
  },

  async getFeatured(limit = 4) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .eq("published", true)
      .limit(limit);

    if (error) return [];
    return (data || []).map(mapDbProductToStorefront);
  },

  async getByCategory(categorySlug, pagination) {
    const supabase = createSupabaseServerClient();
    const [dbProductsRes, category] = await Promise.all([
      supabase.from("products").select("*"),
      supabaseCategoryRepository.getBySlug(categorySlug),
    ]);

    if (!category) return paginate([], pagination);

    const products = (dbProductsRes.data || []).map(mapDbProductToStorefront);

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
    const supabase = createSupabaseServerClient();
    const [dbProductsRes, categories] = await Promise.all([
      supabase.from("products").select("*"),
      supabaseCategoryRepository.list(),
    ]);
    const products = (dbProductsRes.data || []).map(mapDbProductToStorefront);
    return paginate(
      applyProductFilters(products, categories, { search: query }),
      pagination,
    );
  },
};

export const supabaseBrandRepository = {
  async list(): Promise<Brand[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return (data || []).map(mapDbBrandToStorefront);
  },

  async getBySlug(slug: string): Promise<Brand | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return null;
    return mapDbBrandToStorefront(data);
  },

  async getById(id: string): Promise<Brand | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return null;
    return mapDbBrandToStorefront(data);
  },
};

// 1. Sửa hàm list, get của supabasePageRepository (khoảng dòng 385)
export const supabasePageRepository = {
  async list(): Promise<CmsPage[]> {
    const pages = await listJsonData<CmsPage>(
      "pages", // Sửa từ "ecommerce_pages" thành "pages"
      "published_at",
    );
    return pages.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  },
  async getBySlug(slug: string): Promise<CmsPage | null> {
    return getJsonDataBySlug<CmsPage>("pages", slug); // Đổi thành "pages"
  },
  async getById(id: string): Promise<CmsPage | null> {
    return getJsonDataById<CmsPage>("pages", id); // Đổi thành "pages"
  },
};

// 2. Sửa tương tự cho supabaseBlogRepository (khoảng dòng 404)
export const supabaseBlogRepository = {
  async list(params?: PaginationParams): Promise<PaginatedResult<BlogPost>> {
    const posts = await listJsonData<BlogPost>(
      "blog_posts", // Sửa từ "ecommerce_blog_posts" thành "blog_posts"
      "published_at",
    );
    const sorted = posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    return paginate(sorted, params);
  },
  async getBySlug(slug: string): Promise<BlogPost | null> {
    return getJsonDataBySlug<BlogPost>("blog_posts", slug); // Đổi thành "blog_posts"
  },
  async getByTag(
    tag: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<BlogPost>> {
    const posts = await listJsonData<BlogPost>("blog_posts"); // Đổi thành "blog_posts"
    return paginate(
      posts.filter((post) => post.tags.includes(tag)),
      params,
    );
  },
};
/**
 * =========================================================================
 * LƯU ĐƠN HÀNG THỜI GIAN THỰC (REALTIME CHECKOUT INTEGRATION)
 * Sửa lỗi UUID: Để Supabase tự sinh UUID cho đơn hàng, tránh lỗi chữ thường [18]
 * =========================================================================
 */
export async function createSupabaseOrder(order: Order): Promise<Order> {
  const supabase = createSupabaseServerClient();

  // Ép kiểu 'as any' để bỏ qua kiểm duyệt TypeScript nghiêm ngặt đối với PaymentStatus
  const rawPaymentStatus = order.paymentStatus as any;
  const dbPaymentStatus =
    rawPaymentStatus === "paid" || rawPaymentStatus === "Paid"
      ? "Paid"
      : "Pending";

  // 1. Lưu đơn hàng cha vào bảng 'orders' (KHÔNG truyền id ảo, để DB tự sinh UUID) [18]
  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      code: order.orderNumber, // Lưu mã "ORD-MQZD2NKN" vào cột code dạng TEXT
      customer_name: order.shippingAddress
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        : "Khách hàng Storefront",
      customer_email: order.customerEmail,
      total: order.total,
      order_status: "Pending", // Trạng thái mặc định
      payment_status: dbPaymentStatus,
      shipping_status: "Pending",
    })
    .select("id") // Đọc về mã UUID thực tế do Database tự động sinh ra! [18]
    .single();

  if (orderError || !createdOrder) {
    console.error("SUPABASE ORDER ERROR:", orderError);
    throw new Error(
      `Failed to create order: ${orderError?.message || "Unknown error"}`,
    );
  }

  // 2. Lưu các sản phẩm chi tiết vào bảng 'order_items'
  if (order.items && order.items.length > 0) {
    const itemsToInsert = order.items.map((item) => ({
      order_id: createdOrder.id, // Sử dụng UUID chuẩn từ DB trả về! [18]
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("SUPABASE ORDER ITEMS ERROR:", itemsError);
      // Xóa đơn hàng cha nếu chèn sản phẩm chi tiết bị lỗi để tránh rác DB (Rollback) [18]
      await supabase.from("orders").delete().eq("id", createdOrder.id);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }
  }

  // Trả về đối tượng order ban đầu để tránh làm hỏng luồng redirect của Storefront
  return order;
}
