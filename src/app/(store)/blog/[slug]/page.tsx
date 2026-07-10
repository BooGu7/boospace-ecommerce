import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { blogRepository } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { siteConfig } from "@/lib/config";
import { BlogComments } from "@/components/blog/blog-comments"; // Nhập khẩu khung bình luận động mới [21]

interface PostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { items } = await blogRepository.list({ page: 1, limit: 10_000 });
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogRepository.getBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage.url, alt: post.coverImage.alt }]
        : [],
    },
  };
}

// BỘ TRÍCH XUẤT ĐỘNG CÁC THẺ TIÊU ĐỀ H2 ĐỂ BIÊN SOẠN MỤC LỤC TỰ ĐỘNG CHUẨN ĐẸP [21]
function extractHeadings(html: string) {
  const regex = /<h2[^>]*>(.*?)<\/h2>/g;
  const headings: { text: string; id: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, ""); // Xóa bỏ thẻ HTML con nếu có
    const id = text
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s]+/g,
        "",
      )
      .replace(/\s+/g, "-");
    headings.push({ text, id });
  }
  return headings;
}

export default async function BlogPostPage({ params }: PostProps) {
  const { slug } = await params;
  const post = await blogRepository.getBySlug(slug);
  if (!post) notFound();

  // Bóc tách tiêu đề và gán ID liên kết mượt mà cho Mục Lục
  const headings = extractHeadings(post.body);
  let processedBody = post.body;
  headings.forEach((h) => {
    processedBody = processedBody.replace(
      `<h2>${h.text}</h2>`,
      `<h2 id="${h.id}">${h.text}</h2>`,
    );
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: post.author },
    image: post.coverImage?.url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              articleJsonLd,
              breadcrumbJsonLd([
                { name: "Blog", href: "/blog" },
                { name: post.title, href: `/blog/${post.slug}` },
              ]),
            ]),
          }}
        />

        {/* BỐ CỤC 12 CỘT TÍCH HỢP MỤC LỤC STICKY BÊN TRÁI ĐÚNG CHUẨN SANG TRỌNG */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start text-left">
          {/* CỘT TRÁI (3/12): MỤC LỤC STICKY CHỈ HIỂN THỊ TRÊN DESKTOP */}
          <aside className="hidden xl:block xl:col-span-3 sticky top-28 h-fit bg-[#FAF5F2]/60 border border-[#E1DDD5] rounded-3xl p-6 space-y-4">
            <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block border-b border-[#E1DDD5]/60 pb-2">
              Table of Contents
            </span>
            {headings.length > 0 ? (
              <ul className="space-y-3 font-serif text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-black/75 hover:text-[#FF9D00] hover:underline transition-colors block leading-tight font-medium"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#786F66] italic">
                Nhật ký thô mộc ngắn.
              </p>
            )}
          </aside>

          {/* CỘT PHẢI (9/12): THÂN BÀI VIẾT CHÍNH */}
          <div className="xl:col-span-9 max-w-3xl mx-auto w-full space-y-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/blog" />}>
                    Blog
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-black font-medium truncate max-w-[200px] sm:max-w-none">
                    {post.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <article className="space-y-8">
              <header className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#786F66] uppercase font-semibold">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span>·</span>
                  <span>by {post.author}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-tight">
                  {post.title}
                </h1>
                <p className="text-base sm:text-lg text-[#5C564E] leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </header>

              {/* 16:10 cover */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-sm">
                <Image
                  src={post.coverImage?.url ?? PLACEHOLDER_IMAGE}
                  alt={post.coverImage?.alt ?? post.title}
                  fill
                  className="object-cover mix-blend-multiply opacity-95"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </div>

              {/* Thân bài viết xử lý id động cho mục lục tự cuộn */}
              <div
                className="blog-body prose prose-stone max-w-none text-[#1E1C1A] text-sm sm:text-base leading-relaxed space-y-6 scroll-smooth"
                dangerouslySetInnerHTML={{ __html: processedBody }}
              />

              {post.tags.length > 0 && (
                <footer className="border-t border-[#E1DDD5] pt-6 mt-12">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono text-[#786F66] uppercase tracking-wider font-bold">
                      Tags:
                    </span>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                      >
                        <Badge
                          variant="secondary"
                          className="text-[10px] rounded-lg px-2.5 py-0.5 font-mono cursor-pointer hover:bg-black hover:text-white transition-colors border border-[#DCD6CC] bg-[#EAE5D9]/40 text-[#786F66]"
                        >
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </footer>
              )}
            </article>

            {/* KHUNG BÌNH LUẬN ĐỘNG KẾT NỐI SUPABASE ĐÃ ĐƯỢC CHÈN DƯỚI ĐÁY BÀI VIẾT */}
            <BlogComments postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
