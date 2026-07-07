import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Sparkles, SlidersHorizontal, LayoutGrid } from "lucide-react";
import { productRepository, categoryRepository } from "@/lib/repositories";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";
import { SortDropdown } from "@/components/products/sort-dropdown";
import type { SortOption } from "@/types";
import { siteConfig } from "@/lib/config";

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string;
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const canonical =
    page > 1 ? `${siteConfig.url}/shop?page=${page}` : `${siteConfig.url}/shop`;

  return {
    title: "Cửa hàng",
    description:
      "Khám phá những món đồ được tuyển chọn kỹ lưỡng, phù hợp với phong cách sống của bạn ✨",
    alternates: { canonical },
  };
}

const SORT_OPTIONS: Record<string, SortOption> = {
  newest: { field: "createdAt", order: "desc" },
  "price-asc": { field: "price", order: "asc" },
  "price-desc": { field: "price", order: "desc" },
  name: { field: "name", order: "asc" },
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sortKey = params.sort || "newest";
  const categorySlug = params.category;
  const searchQuery = params.q;

  const sort = SORT_OPTIONS[sortKey] ?? SORT_OPTIONS.newest;

  const { items: products, pagination } = await productRepository.list(
    {
      category: categorySlug,
      search: searchQuery,
    },
    sort,
    { page, limit: 40 },
  );

  const allCategories = await categoryRepository.list();
  const categories = allCategories.filter((c) => !c.parentId);

  // Xây dựng các tham số tìm kiếm hiện tại để chuyển phân trang
  const currentParams: Record<string, string> = {};
  if (sortKey !== "newest") currentParams.sort = sortKey;
  if (categorySlug) currentParams.category = categorySlug;
  if (searchQuery) currentParams.q = searchQuery;

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* SECTION 1: HEADER CATALOG */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-[#E1DDD5] pb-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              PRODUCTS CATALOG
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              {categorySlug
                ? (categories.find((c) => c.slug === categorySlug)?.name ??
                  "Shop")
                : searchQuery
                  ? `Kết quả cho "${searchQuery}"`
                  : "Sol Series Catalog"}
            </h1>

            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid className="size-3.5 text-amber-600" />
              Có {pagination.total} mô hình &amp; phụ kiện gỗ đang có sẵn
            </p>
          </div>

          {/* Ô Sắp xếp (Sort Dropdown) */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#786F66] uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="size-3.5" /> Sort by:
            </span>
            <Suspense
              fallback={
                <div className="h-9 w-32 bg-[#EAE5D9]/40 animate-pulse rounded-lg border border-[#E1DDD5]" />
              }
            >
              <SortDropdown currentSort={sortKey} />
            </Suspense>
          </div>
        </div>

        {/* SECTION 2: CATEGORY FILTER PILLS (Lọc động theo tham số ?category=...) [1.1] */}
        <div className="mt-8 flex flex-wrap gap-2.5 items-center">
          <Link
            href="/shop"
            className={`rounded-xl border px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all shadow-xs ${
              !categorySlug
                ? "border-black bg-black text-[#FCFAF2] font-semibold"
                : "border-[#E1DDD5] bg-[#EAE5D9]/20 text-[#5C564E] hover:border-black"
            }`}
          >
            TẤT CẢ SẢN PHẨM
          </Link>

          {categories.map((cat, idx) => {
            const isActive = categorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`} // ĐÃ ĐỒNG BỘ: Sử dụng Query Parameter đúng chuẩn để lọc dữ liệu Supabase [18]
                className={`rounded-xl border px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all shadow-xs ${
                  isActive
                    ? "border-black bg-black text-[#FCFAF2] font-semibold"
                    : "border-[#E1DDD5] bg-[#EAE5D9]/20 text-[#5C564E] hover:border-black"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* SECTION 3: PRODUCT GRID (Lưới sản phẩm thô mộc từ Supabase / JSON) [18] */}
        <div className="mt-12 border-t border-[#E1DDD5] pt-12">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="py-24 text-center border border-[#E1DDD5] border-dashed rounded-3xl text-sm text-[#786F66] font-mono bg-[#EAE5D9]/10">
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>

        {/* SECTION 4: PAGINATION (Bộ chuyển trang e-ink chuẩn Daylight) [1.1] */}
        {pagination.totalPages > 1 && (
          <div className="mt-16 border-t border-[#E1DDD5] pt-12 flex justify-center">
            <Pagination
              pagination={pagination}
              basePath="/shop"
              searchParams={currentParams}
            />
          </div>
        )}
      </div>
    </div>
  );
}
