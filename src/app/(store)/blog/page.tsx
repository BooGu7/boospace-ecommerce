import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/products/pagination";
import { blogRepository } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { siteConfig } from "@/lib/config";

interface BlogIndexProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: BlogIndexProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const canonical =
    page > 1 ? `${siteConfig.url}/blog?page=${page}` : `${siteConfig.url}/blog`;
  return {
    title: "The Journal — Boospace Chronicles",
    description:
      "Hướng dẫn, câu chuyện và chia sẻ từ đội ngũ — về lối sống bền vững, cách bảo quản sản phẩm và những câu chuyện sáng tạo.",
    alternates: { canonical },
  };
}

export default async function BlogIndex({ searchParams }: BlogIndexProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  // Lấy dữ liệu thật từ bảng blog_posts của Supabase [18]
  const { items: posts, pagination } = await blogRepository.list({
    page,
    limit: 9,
  });

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              02 / CHRONICLES OF FLOW
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              The Journal
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-amber-600" />
              Lưu trữ {pagination.total} bài viết &amp; cẩm nang chế tác
            </p>
          </div>
        </div>

        {/* LƯỚI BÀI VIẾT BENTO STYLE */}
        <div className="grid gap-0 border-t border-l border-[#E1DDD5] sm:grid-cols-2 lg:grid-cols-3 bg-[#FCFAF2]">
          {posts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group p-8 space-y-6 flex flex-col justify-between border-r border-b border-[#E1DDD5] hover:bg-white transition-colors"
            >
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#786F66]">
                  0{idx + 1} / {formatDate(post.publishedAt)}
                </div>
                <h2 className="font-bold text-xl text-black group-hover:text-amber-600 font-serif leading-snug transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C564E] line-clamp-3 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#E1DDD5] bg-[#EAE5D9]/20">
                <Image
                  src={post.coverImage?.url ?? PLACEHOLDER_IMAGE}
                  alt={post.coverImage?.alt ?? post.title}
                  fill
                  className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-24 text-center text-[#786F66] font-mono text-xs uppercase border-r border-b border-[#E1DDD5]">
              Chưa có câu chuyện nào trên chuyên mục Journal.
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
