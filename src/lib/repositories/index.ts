import {
  supabaseProductRepository,
  supabaseCategoryRepository,
  supabaseBrandRepository,
  supabasePageRepository,
  supabaseBlogRepository,
} from "./supabase-repositories";

/**
 * SYSTEM DIRECT REPOSITORIES (SUPABASE ONLY)
 * Loại bỏ hoàn toàn tầng dữ liệu JSON tĩnh. Hệ thống kết nối trực tiếp tới đám mây Supabase.
 */
export const productRepository = supabaseProductRepository;

export const categoryRepository = supabaseCategoryRepository;

export const brandRepository = supabaseBrandRepository;

export const pageRepository = supabasePageRepository;

export const blogRepository = supabaseBlogRepository;

// Xuất các hàm trợ giúp lưu trữ đơn hàng Supabase nếu các cổng thanh toán cần gọi tới
export { createSupabaseOrder } from "./supabase-repositories";
