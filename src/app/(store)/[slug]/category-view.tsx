import Link from "next/link";
import { Pagination } from "@/components/products/pagination";
import { ProductGrid } from "@/components/products/product-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import type { Category, PaginationMeta, Product } from "@/types";

interface CategoryViewProps {
  category: Category;
  products: Product[];
  pagination: PaginationMeta;
  subcategories?: Category[];
  ancestors?: Category[];
}

/** Strip parent name prefix from a subcategory display name */
function stripParentPrefix(name: string, parentName: string): string {
  const patterns = [new RegExp(`^${parentName}\\s*[-–—:|]\\s*`, "i"), new RegExp(`^${parentName}\\s+`, "i")];
  for (const pattern of patterns) {
    if (pattern.test(name)) return name.replace(pattern, "");
  }
  return name;
}

export function CategoryView({
  category,
  products,
  pagination,
  subcategories = [],
  ancestors = [],
}: CategoryViewProps) {
  // Full ancestor trail for breadcrumbs — e.g. Shop > Electronics > Headphones
  const trail = [{ name: "Cửa hàng", href: "/shop" }, ...ancestors.map((c) => ({ name: c.name, href: `/${c.slug}` }))];

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd(trail)),
          }}
        />

        {/* BREADCRUMB THANH LỊCH */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList className="font-mono text-xs uppercase tracking-wider text-[#786F66]">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/shop" className="hover:text-black transition-colors" />}>
                  Cửa hàng
                </BreadcrumbLink>
              </BreadcrumbItem>
              {ancestors.map((cat, idx) => {
                const isLast = idx === ancestors.length - 1;
                return (
                  <div key={cat.id} className="contents">
                    <BreadcrumbSeparator className="text-[#A8A196]" />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="font-bold text-black">{cat.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link href={`/${cat.slug}`} className="hover:text-black transition-colors" />}>
                          {cat.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* HEADER KHÔNG GIAN SỐNG */}
        <div className="border-b border-[#E1DDD5] pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit font-bold">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            KHÔNG GIAN SỐNG • BOO SPACE
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-tight">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-sm sm:text-base text-[#5C564E] font-sans leading-relaxed max-w-2xl">
              {category.description}
            </p>
          )}

          <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider pt-1">
            Có {pagination.total} vật thể trong không gian này
          </p>
        </div>

        {/* SUBCATEGORIES PILLS */}
        {subcategories.length > 0 && (
          <nav
            aria-label="Danh mục phụ"
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/${sub.slug}`}
                className="rounded-2xl border border-[#E1DDD5] bg-white/70 hover:bg-white px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#5C564E] hover:text-black hover:border-black/40 transition-all shadow-xs"
              >
                {stripParentPrefix(sub.name, category.name)}
              </Link>
            ))}
          </nav>
        )}

        {/* LƯỚI SẢN PHẨM */}
        <div className="mt-12">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="py-24 text-center border border-[#E1DDD5] border-dashed rounded-3xl text-sm text-[#786F66] font-mono bg-[#EAE5D9]/10 space-y-2">
              <p className="font-serif text-lg text-black font-bold">Chưa có sản phẩm trong mục này</p>
              <p className="text-xs text-[#5C564E]">Vui lòng quay lại cửa hàng để khám phá thêm các vật thể khác.</p>
            </div>
          )}
        </div>

        {/* PHÂN TRANG */}
        {pagination.totalPages > 1 && (
          <div className="mt-16 border-t border-[#E1DDD5] pt-12 flex justify-center">
            <Pagination pagination={pagination} basePath={`/${category.slug}`} />
          </div>
        )}
      </div>
    </div>
  );
}
