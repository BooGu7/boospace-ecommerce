// JSON stays as the local fallback. When Supabase env vars are present, the
// app reads catalog, CMS, and blog data from Supabase instead.

import { hasSupabaseConfig } from "@/lib/supabase/server"
import { jsonProductRepository } from "./json-product-repository"
import { jsonCategoryRepository } from "./json-category-repository"
import { jsonBrandRepository } from "./json-brand-repository"
import { jsonPageRepository } from "./json-page-repository"
import { jsonBlogRepository } from "./json-blog-repository"
import {
  supabaseBlogRepository,
  supabaseBrandRepository,
  supabaseCategoryRepository,
  supabasePageRepository,
  supabaseProductRepository,
} from "./supabase-repositories"

const useSupabase = hasSupabaseConfig()

export const productRepository = useSupabase
  ? supabaseProductRepository
  : jsonProductRepository
export const categoryRepository = useSupabase
  ? supabaseCategoryRepository
  : jsonCategoryRepository
export const brandRepository = useSupabase
  ? supabaseBrandRepository
  : jsonBrandRepository
export const pageRepository = useSupabase
  ? supabasePageRepository
  : jsonPageRepository
export const blogRepository = useSupabase
  ? supabaseBlogRepository
  : jsonBlogRepository
