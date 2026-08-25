// ============================================================================
// BOOSPACE STUDIO — CORE ECOMMERCE TYPES & INTERFACES
// File: src/types/index.ts
// ============================================================================

// --- 1. BRAND & PARTNERS ---

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string | null;
  logo_url?: string | null;
  website?: string | null;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- 2. CATEGORY & COLLECTIONS ---

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  desc?: string;
  imageUrl?: string | null;
  image_url?: string | null;
  image?: ProductImage;
  parentId?: string | null;
  parent_id?: string | null;
  order: number;
  sort_order?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- 3. PRODUCT & 3D SPECIFICATIONS ---

export type ProductStatus = "draft" | "active" | "archived";

export interface ProductImage {
  id?: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductOption {
  name: string; // e.g. "Màu phôi", "Chất liệu", "Kích thước"
  value: string; // e.g. "Xám mờ / Đen", "CR-PETG", "Standard"
}

export interface VariantInventory {
  quantity: number;
  trackInventory?: boolean;
  allowBackorder: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number; // in cents (VND * 100)
  compareAtPrice?: number | null;
  currency: string;
  inventory: VariantInventory;
  options: ProductOption[];
  images: ProductImage[];
  weight?: number; // Grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ColorItem {
  name: string;
  hex: string;
}

export interface Product3DAttributes {
  material?: string; // "CR-PETG" | "PLA" | "ABS" | "Resin"
  color_name?: string; // "Xám mờ / Đen, Đỏ Ruby, Trắng ngà"
  color_hex?: string; // "#334155, #f02d2d, #f8f6f0"
  colors?: ColorItem[];
  resolution?: string; // "0.12mm" | "0.15mm" | "0.20mm"
  print_time?: string; // "3.5h", "8h"
  infill?: string; // "Gyroid Infill 25%"
  waterproof?: string; // "Kháng nước & bụi mịn"
  safety_factor?: string; // "Không mùi sinh học"
  assembly?: string; // "Nguyên khối"
  packaging?: string; // "Hộp carton sóng E"
  license?: string; // "CC License"
  scale?: string; // "100%"
  [key: string]: unknown;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  barcode?: string | null;
  description: string;
  shortDescription?: string;
  short_description?: string;
  body?: string;
  images: ProductImage[];
  status: ProductStatus;
  published?: boolean;
  brandId?: string | null;
  brand_id?: string | null;
  categoryIds: string[];
  category_id?: string | null;
  tags: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  review_count?: number;
  featured: boolean;
  stock?: number;
  weight?: number; // Grams (mặc định 150g - 380g)
  price?: number;
  comparePrice?: number | null;
  compare_price?: number | null;
  costPrice?: number | null;
  cost_price?: number | null;
  attributes?: Product3DAttributes;
  seo_title?: string | null;
  seo_description?: string | null;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
}

// --- 4. CART & SHOPPING BAG ---

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  variantName: string;
  image: ProductImage;
  slug: string;
  price: number; // in cents (VND * 100)
  quantity: number;
  lineTotal: number; // in cents
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// --- 5. ORDERS & 7-STEP LIFECYCLE ---

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "processing_3d_print"
  | "handed_over"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded"
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled"
  | string;

export type PaymentStatus =
  | "pending"
  | "Pending"
  | "paid"
  | "Paid"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | string;

export interface OrderLineItem {
  id: string;
  orderId?: string;
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  sku?: string;
  image?: ProductImage;
  price: number;
  unit_price?: number;
  quantity: number;
  total: number;
  total_price?: number;
}

export interface Order {
  id: string;
  code?: string;
  orderNumber: string;
  userId?: string;
  customerId?: string | null;
  customer_id?: string | null;
  customerName: string;
  customer_name?: string;
  customerEmail: string;
  customer_email?: string;
  customerPhone?: string;
  customer_phone?: string;
  customerAddress?: string;
  customer_address?: string;
  items: OrderLineItem[];
  status: OrderStatus;
  order_status?: OrderStatus;
  paymentStatus: PaymentStatus;
  payment_status?: PaymentStatus;
  paymentMethod?: string;
  payment_method?: string;
  shippingCarrier?: string;
  shipping_carrier?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress: Address | Record<string, unknown>;
  shipping_address?: Address | Record<string, unknown>;
  billingAddress?: Address;
  appliedCouponId?: string | null;
  applied_coupon_id?: string | null;
  notes?: string | null;
  packagingNote?: string;
  packaging_note?: string;
  trackingCode?: string | null;
  tracking_code?: string | null;
  shipperName?: string | null;
  shipperPhone?: string | null;
  isManualOrder?: boolean;
  delayedAlert?: boolean;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
}

// --- 6. USER, AUTHENTICATION & PROFILES ---

export type UserRole = "customer" | "staff" | "admin";

export type AddressType = "shipping" | "billing";

export interface Address {
  id: string;
  type?: AddressType;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  district?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  formattedAddress?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

// --- 7. BLOG & CMS PAGES ---

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  short_description?: string;
  body: string;
  content?: string;
  author?: string;
  tags: string[];
  coverImage?: ProductImage | null;
  cover_image?: string | null;
  publishedAt: string;
  published_at?: string;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  content?: string;
  publishedAt?: string;
  published_at?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  comment: string;
  user_id?: string | null;
  created_at: string;
}

// --- 8. REVIEWS, COUPONS & CONTACTS ---

export interface Review {
  id: string;
  productId?: string;
  product_id?: string;
  userId?: string | null;
  user_id?: string | null;
  customerName?: string;
  customer_name?: string;
  rating: number; // 1 - 5
  title?: string;
  comment?: string;
  content?: string;
  imageUrl?: string | null;
  image_url?: string | null;
  verified?: boolean;
  createdAt?: string;
  created_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  user_id?: string | null;
  created_at: string;
}

// --- 9. PAYMENTS & TRANSACTIONS ---

export type PaymentMethod =
  | "card"
  | "bank_transfer"
  | "vietqr"
  | "VietQR"
  | "cod"
  | "COD"
  | "other";

export interface Transaction {
  id: string;
  order_id: string | null;
  order_code: string | null;
  gateway_code: string;
  reference_number: string;
  amount: number;
  currency: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded" | string;
  payment_method: string;
  memo?: string | null;
  raw_payload?: Record<string, unknown>;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// --- 10. REPOSITORIES & INFRASTRUCTURE ---

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export type SortOrder = "asc" | "desc";

export interface SortOption {
  field: string;
  order: SortOrder;
}

export interface PriceRange {
  min?: number;
  max?: number;
}

export interface ProductFilters {
  category?: string;
  priceRange?: PriceRange;
  inStock?: boolean;
  search?: string;
  tags?: string[];
}

export interface ProductRepository {
  list(
    filters?: ProductFilters,
    sort?: SortOption,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getFeatured(limit?: number): Promise<Product[]>;
  getByCategory(
    categorySlug: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
  search(
    query: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
}

export interface CategoryRepository {
  list(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
  getById(id: string): Promise<Category | null>;
  getChildren?(parentId: string): Promise<Category[]>;
  getTopLevel?(): Promise<Category[]>;
  getAncestors?(categoryId: string): Promise<Category[]>;
}

export interface BrandRepository {
  list(): Promise<Brand[]>;
  getBySlug(slug: string): Promise<Brand | null>;
  getById(id: string): Promise<Brand | null>;
}

export interface PageRepository {
  list(): Promise<CmsPage[]>;
  getBySlug(slug: string): Promise<CmsPage | null>;
  getById(id: string): Promise<CmsPage | null>;
}

export interface BlogRepository {
  list(params?: PaginationParams): Promise<PaginatedResult<BlogPost>>;
  getBySlug(slug: string): Promise<BlogPost | null>;
  getByTag(
    tag: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<BlogPost>>;
}

export interface OrderRepository {
  list(
    userId?: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Order>>;
  getById(id: string): Promise<Order | null>;
  create(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}

// --- 11. CHECKOUT PROVIDERS & API CONTRACTS ---

export interface CheckoutSession {
  id: string;
  url: string;
  status: "open" | "complete" | "expired";
  orderId?: string;
  metadata?: Record<string, string>;
}

export interface WebhookResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export interface CheckoutProvider {
  createSession(
    cart: Cart,
    customer?: { email: string; shippingAddress?: Address },
  ): Promise<CheckoutSession>;
  getSession(sessionId: string): Promise<CheckoutSession>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookResult>;
}

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ApiError };

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, string[]>;
}
