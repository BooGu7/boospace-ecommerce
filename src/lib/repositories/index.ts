import { jsonProductRepository } from "./json-product-repository";
import { jsonCategoryRepository } from "./json-category-repository";
import { jsonBrandRepository } from "./json-brand-repository";
import { jsonPageRepository } from "./json-page-repository";
import { jsonBlogRepository } from "./json-blog-repository";

import {
  supabaseProductRepository,
  supabaseCategoryRepository,
  supabaseBrandRepository,
  supabasePageRepository,
  supabaseBlogRepository,
} from "./supabase-repositories";

/**
 * SAFE ENV CHECK (NO hasSupabaseConfig)
 */
const useSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

/**
 * SWITCH BACKEND AUTOMATICALLY
 * (SAFE FOR NEXT.JS BUILD)
 */
export const productRepository = useSupabase
  ? supabaseProductRepository
  : jsonProductRepository;

export const categoryRepository = useSupabase
  ? supabaseCategoryRepository
  : jsonCategoryRepository;

export const brandRepository = useSupabase
  ? supabaseBrandRepository
  : jsonBrandRepository;

export const pageRepository = useSupabase
  ? supabasePageRepository
  : jsonPageRepository;

export const blogRepository = useSupabase
  ? supabaseBlogRepository
  : jsonBlogRepository;