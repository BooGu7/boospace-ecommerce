import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, BookOpen, X } from "lucide-react";
import { Pagination } from "@/components/products/pagination";
import { blogRepository } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { siteConfig } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

interface BlogIndexProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export async function generateMetadata({
  searchParams,
}: BlogIndexProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const tag = params.tag ?? "";

  const canonical =
    page > 1 ? `${siteConfig.url}/blog?page=${page}` : `${siteConfig.url}/blog`;
  return {
    title: tag
      ? `Chủ đề #${tag} — The Journal Boo Space`
      : "The Journal — Boo Space Chronicles",
    description:
      "Hướng dẫn, câu chuyện và chia sẻ từ đội ngũ — về lối sống bền vững, cách bảo quản sản phẩm và những câu chuyện sáng tạo.",
    alternates: { canonical },
  };
}

export default async function BlogIndex({ searchParams }: BlogIndexProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const tag = params.tag ?? ""; // Đọc thẻ lọc của người dùng gửi lên

  // Lấy dữ liệu bài viết động từ Supabase (Hỗ trợ lọc theo Tag thực tế nếu có truyền tham số) [21]
  const { items: posts, pagination } = tag
    ? await blogRepository.getByTag(tag, { page, limit: 9 })
    : await blogRepository.list({ page, limit: 9 });

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION - ĐÃ DỌN SẠCH CHỈ MỤC SỐ RƯỜM RÀ */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit font-bold">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              THE JOURNAL
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Nhật ký hành trình
            </h1>

            {/* Thanh hiển thị bộ lọc thẻ đang hoạt động nếu có */}
            {tag ? (
              <div className="flex items-center gap-2 bg-[#EAE5D9]/40 border border-[#DCD6CC] px-4 py-2 rounded-xl w-fit text-xs font-mono">
                <span className="text-black font-bold">
                  Đang xem thẻ: #{tag}
                </span>
                <Link
                  href="/blog"
                  className="text-red-500 hover:text-red-600 ml-2"
                >
                  <X className="h-3.5 w-3.5 inline" />
                </Link>
              </div>
            ) : (
              <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-amber-600" />
                Lưu trữ {pagination.total} bài viết &amp; cẩm nang thiết lập
                không gian
              </p>
            )}
          </div>
        </div>

        {/* LƯỚI BÀI VIẾT BENTO STYLE LỒNG MẠNG LƯỚI KỸ THUẬT */}
        <div className="grid gap-0 border-t border-l border-[#E1DDD5] sm:grid-cols-2 lg:grid-cols-3 bg-[#FCFAF2]">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className="group p-8 space-y-6 flex flex-col justify-between border-r border-b border-[#E1DDD5] hover:bg-white transition-colors text-left"
            >
              <div className="space-y-4">
                <div className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                  CHUYÊN MỤC 0{idx + 1} / {formatDate(post.publishedAt)}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="font-bold text-xl text-black group-hover:text-amber-600 font-serif leading-snug transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-xs sm:text-sm text-[#5C564E] line-clamp-3 leading-relaxed font-light font-sans">
                  {post.excerpt}
                </p>
              </div>

              {/* Cover Image & Interactive Tags */}
              <div className="space-y-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#E1DDD5] bg-[#EAE5D9]/20"
                >
                  <Image
                    src={post.coverImage?.url || PLACEHOLDER_IMAGE}
                    alt={post.coverImage?.alt || post.title}
                    fill
                    className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>

                {/* Tương tác Tags trực tiếp của bài viết bên dưới Card */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((t) => (
                      <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
                        <span className="text-[9px] font-mono font-bold text-[#786F66] bg-[#EAE5D9]/40 border border-[#DCD6CC] px-2 py-0.5 rounded-md hover:bg-black hover:text-white transition-all">
                          #{t}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full py-24 text-center text-[#786F66] font-mono text-xs uppercase border-r border-b border-[#E1DDD5]">
              Chưa có bài viết nào phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>

        {/* BỘ PHÂN TRANG */}
        {pagination.totalPages > 1 && (
          <div className="mt-16 border-t border-[#E1DDD5] pt-12 flex justify-center">
            <Pagination pagination={pagination} basePath="/blog" />
          </div>
        )}
      </div>
    </div>
  );
}
