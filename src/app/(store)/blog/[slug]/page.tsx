import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { siteConfig } from "@/lib/config";
import { pageRepository } from "@/lib/repositories";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // Cache 24 giờ

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await pageRepository.getBySlug(slug);
  if (!page) return { title: "Not Found" };

  const excerpt = page.excerpt || page.title;

  return {
    title: page.title,
    description: excerpt,
    alternates: { canonical: `/pages/${page.slug}` },
    openGraph: {
      title: page.title,
      description: excerpt,
      type: "article",
      url: `${siteConfig.url}/pages/${page.slug}`,
    },
  };
}

export default async function CmsPageDetail({ params }: PageProps) {
  const { slug } = await params;
  const page = await pageRepository.getBySlug(slug);
  if (!page) notFound();

  const pageContent =
    (page as unknown as { content?: string; body?: string }).content ||
    page.body ||
    "";
  const pageDate =
    page.updatedAt || page.publishedAt || new Date().toISOString();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Pages", href: "/pages" },
              { name: page.title, href: `/pages/${page.slug}` },
            ]),
          ),
        }}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/pages" />}>
              Pages
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{page.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className="mt-6 text-left">
        <header>
          <h1 className="text-4xl font-bold tracking-tight font-serif text-black">
            {page.title}
          </h1>
          <p className="mt-2 text-sm font-mono text-[#786F66]">
            Updated {formatDate(pageDate)}
          </p>
        </header>

        <div
          className="blog-body mt-10 font-sans text-base leading-relaxed text-[#1E1C1A]"
          dangerouslySetInnerHTML={{ __html: String(pageContent) }}
        />
      </article>
    </div>
  );
}
