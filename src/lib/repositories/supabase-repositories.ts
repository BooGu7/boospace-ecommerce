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
 * BỘ CHUYỂN ĐỔI CHUỖI LAI CHO PAGES (HYBRID CONTENT HELPER)
 * Khớp hoàn hảo với trang Pages gọi dangerouslySetInnerHTML={page.content} [30]
 * =========================================================================
 */
function createHybridContent(content: string) {
  const safeContent = content || "";
  const hybrid = new String(safeContent);
  (hybrid as any).__html = safeContent;
  return hybrid;
}

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

  // Nhân với 100 để triệt tiêu phép chia 100 trong hàm formatPrice của Storefront [21]
  const price = Number(dbProduct.price ?? 0) * 100;
  const comparePrice = dbProduct.compare_price
    ? Number(dbProduct.compare_price) * 100
    : null;

  const defaultVariant = {
    id: dbProduct.id + "-default",
    name: "Default Variant",
    sku: dbProduct.sku || "",
    price: price,
    compareAtPrice: comparePrice,
    inventory: {
      quantity: dbProduct.stock ?? 99,
      allowBackorder: true,
    },
  };

  // SỬA LỖI HÌNH ẢNH: Đổi mảng link string thành mảng object có chứa trường url [21]
  const dbImages = dbProduct.images || [];
  const mappedImages = dbImages.map((url: string, index: number) => ({
    id: `${dbProduct.id}-img-${index}`,
    url: url,
    alt: dbProduct.name,
  }));

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description || "",
    shortDescription: dbProduct.short_description || "",
    status: dbProduct.published ? "active" : "draft",
    featured: dbProduct.featured || false,
    images: mappedImages, // Sử dụng mảng hình ảnh đã map dạng Object [21]
    categoryIds: dbProduct.category_id ? [dbProduct.category_id] : [],
    brandId: dbProduct.brand_id,
    tags: [],
    variants: [defaultVariant],
    attributes: dbProduct.attributes || {},

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
 * BỘ CHUYỂN ĐỔI CHO BLOG & PAGES (ÁP DỤNG HYBRID CONTENT)
 */
function mapDbBlogPostToStorefront(dbPost: any): BlogPost {
  if (!dbPost) return null as any;
  return {
    id: dbPost.id,
    slug: dbPost.slug,
    title: dbPost.title,
    // Ánh xạ cột content trong database thành trường body của Storefront [30]
    body: dbPost.content || "",
    // Ánh xạ cột short_description trong database thành trường excerpt của Storefront
    excerpt: dbPost.short_description || "",
    author: "Boospace", // Giá trị tác giả mặc định
    // Chuyển đổi chuỗi URL thành một đối tượng coverImage có chứa url và alt
    coverImage: dbPost.cover_image
      ? { url: dbPost.cover_image, alt: dbPost.title }
      : null,
    publishedAt:
      dbPost.published_at || dbPost.created_at || new Date().toISOString(),
    createdAt: dbPost.created_at || new Date().toISOString(),
    updatedAt: dbPost.updated_at || new Date().toISOString(),
    tags: dbPost.tags || [],
  } as unknown as BlogPost;
}

function mapDbPageToStorefront(dbPage: any): CmsPage {
  if (!dbPage) return null as any;
  return {
    id: dbPage.id,
    slug: dbPage.slug,
    title: dbPage.title,
    // Sử dụng bộ chuyển đổi lai vì trang Pages gọi trực tiếp dangerouslySetInnerHTML={page.content} [30]
    content: createHybridContent(dbPage.content),
    publishedAt:
      dbPage.published_at || dbPage.created_at || new Date().toISOString(),
    createdAt: dbPage.created_at || new Date().toISOString(),
    updatedAt: dbPage.updated_at || new Date().toISOString(),
  } as unknown as CmsPage;
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
 * EXPORTS CHUẨN ĐỒNG BỘ ĐẦY ĐỦ CHO TOÀN DỰ ÁN (SỬ DỤNG SQL PHẲNG)
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

export const supabasePageRepository = {
  async list(): Promise<CmsPage[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("title", { ascending: true });

    if (error) return [];
    return (data || []).map(mapDbPageToStorefront);
  },

  async getBySlug(slug: string): Promise<CmsPage | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return null;
    return mapDbPageToStorefront(data);
  },

  async getById(id: string): Promise<CmsPage | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return null;
    return mapDbPageToStorefront(data);
  },
};

export const supabaseBlogRepository = {
  async list(params?: PaginationParams): Promise<PaginatedResult<BlogPost>> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return paginate([], params);
    const posts = (data || []).map(mapDbBlogPostToStorefront);
    return paginate(posts, params);
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return null;
    return mapDbBlogPostToStorefront(data);
  },

  async getByTag(
    tag: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<BlogPost>> {
    const postsResult = await this.list();
    return paginate(
      postsResult.items.filter((post) => post.tags.includes(tag)),
      params,
    );
  },
};

/**
 * =========================================================================
 * LƯU ĐƠN HÀNG THỜI GIAN THỰC (REALTIME CHECKOUT INTEGRATION) [18]
 * =========================================================================
 */
export async function createSupabaseOrder(order: Order): Promise<Order> {
  const supabase = createSupabaseServerClient();

  const rawPaymentStatus = order.paymentStatus as any;
  const dbPaymentStatus =
    rawPaymentStatus === "paid" || rawPaymentStatus === "Paid"
      ? "Paid"
      : "Pending";

  // 1. Lưu đơn hàng cha vào bảng 'orders' [18]
  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      code: order.orderNumber,
      customer_name: order.shippingAddress
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        : "Khách hàng Storefront",
      customer_email: order.customerEmail,
      total: order.total,
      order_status: "Pending",
      payment_status: dbPaymentStatus,
      shipping_status: "Pending",
    })
    .select("id")
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
      order_id: createdOrder.id,
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
      await supabase.from("orders").delete().eq("id", createdOrder.id);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }
  }

  return order;
}
