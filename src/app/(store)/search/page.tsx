import type { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, HelpCircle } from "lucide-react";
import { productRepository } from "@/lib/repositories";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";

export const metadata: Metadata = {
  title: "Tìm kiếm thiết kế — Boo Space",
  description:
    "Tìm kiếm các thiết kế mộc, phụ kiện workspace và giải pháp tổ chức góc làm việc sáng tạo độc bản tại Boo Space.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

// Danh sách từ khóa gợi ý tìm kiếm mộc mạc cao cấp
const suggestedKeywords = [
  "Kệ gỗ",
  "Chậu cây",
  "Công thái học",
  "Setup tối giản",
  "Gỗ sồi",
  "Khay cắm",
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Number(params.page) || 1;

  const hasQuery = query.trim().length > 0;

  // Truy cập cơ sở dữ liệu Supabase để tìm kiếm sản phẩm thời gian thực
  const results = hasQuery
    ? await productRepository.search(query, { page, limit: 12 })
    : null;

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50 text-left">
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
              07 / CATALOGUE EXPLORER
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Tìm kiếm thiết kế
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Khám phá hệ sinh thái may đo góc làm việc của Boo Space
            </p>
          </div>
        </div>

        {/* CẤU TRÚC THANH TÌM KIẾM DẸT TRÒN LỒNG KÍNH */}
        <form
          className="relative max-w-2xl bg-white border border-[#CFCABF] rounded-full p-1.5 flex items-center focus-within:ring-1 focus-within:ring-[#FF9D00] transition-all shadow-sm"
          action="/search"
          method="get"
        >
          <Search className="absolute left-5 h-4 w-4 text-[#786F66]" />
          <Input
            name="q"
            placeholder="Tìm kiếm thiết kế mộc, phụ kiện workspace..."
            defaultValue={query}
            className="w-full bg-transparent pl-12 pr-6 py-6 text-sm text-black font-sans font-medium border-0 focus:outline-none focus:ring-0 placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="rounded-full bg-black hover:bg-[#33302C] text-white font-mono uppercase text-[10px] font-bold tracking-widest px-6 py-3 cursor-pointer transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {/* ==========================================
           TRẠNG THÁI 1: HIỂN THỊ KẾT QUẢ TÌM THẤY TỪ SUPABASE
           ========================================== */}
        {hasQuery && results && results.items.length > 0 && (
          <div className="mt-12 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 border-b border-[#E1DDD5]/60 pb-3">
              <Sparkles className="h-4 w-4 text-[#FF9D00]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#786F66] font-bold">
                Tìm thấy {results.pagination.total} kết quả phù hợp cho &quot;
                {query}&quot;
              </span>
            </div>

            {/* Lưới hiển thị danh sách sản phẩm mượt mà */}
            <div className="mt-8">
              <ProductGrid products={results.items} />
            </div>

            {/* Phân trang đồng bộ */}
            <div className="mt-16">
              <Pagination
                pagination={results.pagination}
                basePath="/search"
                searchParams={{ q: query }}
              />
            </div>
          </div>
        )}

        {/* ==========================================
           TRẠNG THÁI 2: CHƯA NHẬP TỪ KHÓA (UX TRỢ GIÚP GỢI Ý ĐỘC ĐÁO)
           ========================================== */}
        {!hasQuery && (
          <div className="mt-16 max-w-2xl text-left space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-black flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#786F66]" />
                Bạn đang tìm kiếm điều gì?
              </h3>
              <p className="text-xs leading-relaxed text-[#786F66] font-sans">
                Hãy thử nhập tên sản phẩm, chất liệu gỗ sồi tự nhiên, dòng chậu
                cây in 3D chịu lực hoặc các giải pháp giấu dây gọn gàng cho góc
                làm việc của bạn.
              </p>
            </div>

            {/* Khối tag từ khóa gợi ý bấm tìm kiếm nhanh */}
            <div className="space-y-2 pt-2 border-t border-[#E1DDD5]/40">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#786F66] font-bold">
                Gợi ý từ khóa tìm kiếm phổ biến
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {suggestedKeywords.map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-[#DCD6CC] bg-white px-4 py-2 text-xs font-mono text-black hover:border-black hover:bg-[#EAE5D9]/20 transition-all"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
           TRẠNG THÁI 3: KHÔNG TÌM THẤY KẾT QUẢ PHÙ HỢP
           ========================================== */}
        {hasQuery && results && results.items.length === 0 && (
          <div className="mt-20 text-center max-w-md mx-auto space-y-4 py-12 rounded-3xl border border-dashed border-[#E1DDD5] bg-[#EAE5D9]/10 animate-in fade-in duration-300">
            <p className="text-sm font-sans text-[#786F66] leading-relaxed px-6">
              Không tìm thấy sản phẩm thủ công nào phù hợp với từ khóa &quot;
              <strong className="text-black">{query}</strong>&quot;. Bạn hãy thử
              đổi từ khóa đơn giản hơn như &quot;kệ&quot; hoặc &quot;chậu&quot;
              xem sao nhé ✨
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="text-xs font-mono uppercase tracking-widest text-black hover:underline"
              >
                Khám phá toàn bộ danh mục sản phẩm →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
