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

export default async function BlogPostPage({ params }: PostProps) {
  const { slug } = await params;
  const post = await blogRepository.getBySlug(slug);
  if (!post) notFound();

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

        <div className="max-w-3xl mx-auto space-y-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/blog" />}>
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-black font-medium">
                  {post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <article className="space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#786F66] uppercase">
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

            {/* Thân bài viết sử dụng dangerouslySetInnerHTML với post.body thô mượt mà */}
            <div
              className="blog-body prose prose-stone max-w-none text-[#1E1C1A] text-sm sm:text-base leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {post.tags.length > 0 && (
              <footer className="border-t border-[#E1DDD5] pt-6 mt-12">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-[#786F66] uppercase tracking-wider font-bold">
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs rounded-lg px-2.5 py-0.5 font-mono"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
