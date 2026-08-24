import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, User } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { sanitizeBlogContent } from "@/lib/sanitize-html";

export const revalidate = 0; // Luôn nạp bài viết mới nhất

interface Props {
  params: Promise<{ slug: string }>;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;

  // Truy vấn bài viết từ Supabase
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Lọc và làm sạch mã HTML (Đã bao gồm cấp phép nhúng Video & Iframe)
  const cleanContentHtml = sanitizeBlogContent(post.content || "");

  const publishDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Gần đây";

  return (
    <article className="min-h-screen bg-[#FCFAF2] text-[#2C2825] font-sans antialiased pb-24 selection:bg-[#FF9D00] selection:text-black">
      {/* BREADCRUMB NAVIGATION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
          <Link href="/" className="hover:text-stone-900 transition">
            Trang chủ
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/blog" className="hover:text-stone-900 transition">
            Nhật ký &amp; Blog
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-stone-800 truncate max-w-[240px] font-bold">
            {post.title}
          </span>
        </nav>
      </div>

      {/* HEADER BÀI VIẾT */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(post.tags || []).map((t: string) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-200/70 text-stone-800 border border-stone-300"
            >
              #{t}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-950 leading-[1.2]">
          {post.title}
        </h1>

        {post.short_description && (
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-serif italic border-l-2 border-[#FF9D00] pl-4 py-1">
            {post.short_description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs font-mono text-stone-500 pt-2 border-t border-stone-200">
          <span className="flex items-center gap-1.5 font-semibold text-stone-700">
            <User className="size-3.5 text-[#FF9D00]" /> Boo Space Studio
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" /> {publishDate}
          </span>
        </div>
      </header>

      {/* ẢNH BÌA HERO (NẾU CÓ) */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-stone-200 shadow-sm bg-stone-100">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* NỘI DUNG CHI TIẾT (RENDER VIDEO, IFRAME & MARKDOWN HTML CHUẨN) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className="blog-content-body prose prose-stone max-w-none 
            prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-950
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-base prose-p:my-4
            prose-strong:text-stone-950 prose-strong:font-bold
            prose-blockquote:border-l-4 prose-blockquote:border-[#FF9D00] prose-blockquote:bg-stone-100/60 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:my-6
            prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-stone-200 prose-img:my-6
            prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-stone-300 prose-table:my-6
            prose-th:border prose-th:border-stone-300 prose-th:bg-stone-200/60 prose-th:p-2.5 prose-th:text-xs prose-th:font-bold
            prose-td:border prose-td:border-stone-300 prose-td:p-2.5 prose-td:text-xs
            prose-a:text-[#FF9D00] prose-a:font-bold prose-a:underline hover:prose-a:text-orange-600
            [&_.aspect-video]:aspect-video [&_.aspect-video]:w-full [&_.aspect-video]:my-8 [&_.aspect-video]:rounded-2xl [&_.aspect-video]:overflow-hidden [&_.aspect-video]:shadow-md [&_.aspect-video]:border [&_.aspect-video]:border-stone-200 [&_.aspect-video]:bg-black"
          dangerouslySetInnerHTML={{ __html: cleanContentHtml }}
        />
      </main>
    </article>
  );
}
