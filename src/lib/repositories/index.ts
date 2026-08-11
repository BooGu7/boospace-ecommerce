import {
  createSupabaseOrder,
  supabaseBlogRepository,
  supabaseBrandRepository,
  supabaseCategoryRepository,
  supabasePageRepository,
  supabaseProductRepository,
} from "./supabase-repositories";

/**
 * SYSTEM DIRECT REPOSITORIES (SUPABASE ONLY)
 * Xuất đồng thời cả alias ngắn (categoryRepository) lẫn alias gốc (supabaseCategoryRepository)
 * để tất cả các component đều nhận diện thành công dữ liệu Supabase.
 */
export const productRepository = supabaseProductRepository;
export const categoryRepository = supabaseCategoryRepository;
export const brandRepository = supabaseBrandRepository;
export const pageRepository = supabasePageRepository;
export const blogRepository = supabaseBlogRepository;

export {
  supabaseBlogRepository,
  supabaseBrandRepository,
  supabaseCategoryRepository,
  supabasePageRepository,
  supabaseProductRepository,
  createSupabaseOrder,
};
