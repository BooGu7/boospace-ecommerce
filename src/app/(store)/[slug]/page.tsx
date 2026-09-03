import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  brandRepository,
  categoryRepository,
  productRepository,
} from "@/lib/repositories";
import type { PaginationMeta } from "@/types";
import { BrandView } from "./brand-view";
import { CategoryView } from "./category-view";
import { ProductDetailView } from "./product-detail-view";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/structured-data";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);

  if (product) {
    const variant = product.variants[0];
    const imageUrl = product.images[0]?.url?.startsWith("http")
      ? product.images[0].url
      : product.images[0]?.url
        ? `${siteConfig.url}${product.images[0].url}`
        : `${siteConfig.url}/logo.png`;

    return {
      title: product.name,
      description: product.shortDescription || product.description,
      alternates: { canonical: `/${product.slug}` },
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description,
        type: "website",
        url: `${siteConfig.url}/${product.slug}`,
        images: [
          {
            url: imageUrl,
            alt: product.images[0]?.alt || product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.shortDescription || product.description,
        images: [imageUrl],
      },
      other: {
        "product:price:amount": variant ? String(variant.price / 100) : "",
        "product:price:currency": variant?.currency ?? "VND",
      },
    };
  }

  const category = await categoryRepository.getBySlug(slug);
  if (category) {
    return {
      title: category.name,
      description: category.description,
      alternates: { canonical: `/${category.slug}` },
    };
  }

  const brand = await brandRepository.getBySlug(slug);
  if (brand) {
    return {
      title: brand.name,
      description: brand.description,
      alternates: { canonical: `/${brand.slug}` },
    };
  }

  return { title: "Not Found" };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  // 1. Kiểm tra Trang Sản phẩm
  const product = await productRepository.getBySlug(slug);

  if (product) {
    const productCategories = await Promise.all(
      (product.categoryIds || []).map((id) =>
        categoryRepository.getById(id).catch(() => null),
      ),
    );

    const validCategories = productCategories.filter(
      (c): c is NonNullable<typeof c> => c !== null,
    );
    const primaryCategory =
      validCategories.find((c) => c.parentId) ?? validCategories[0] ?? null;

    const [relatedProducts, brand, categoryAncestors] = await Promise.all([
      primaryCategory
        ? productRepository
            .getByCategory(primaryCategory.slug, { page: 1, limit: 5 })
            .then((r) => r.items.filter((p) => p.id !== product.id).slice(0, 4))
            .catch(() => [])
        : Promise.resolve([]),

      product.brandId
        ? brandRepository.getById(product.brandId).catch(() => null)
        : Promise.resolve(null),

      primaryCategory
        ? categoryRepository.getAncestors(primaryCategory.id).catch(() => [])
        : Promise.resolve([]),
    ]);

    const breadcrumbTrail = [
      { name: "Cửa hàng", href: "/shop" },
      ...categoryAncestors.map((c) => ({ name: c.name, href: `/${c.slug}` })),
      { name: product.name, href: `/${product.slug}` },
    ];

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              productJsonLd(product, brand, primaryCategory),
              breadcrumbJsonLd(breadcrumbTrail),
            ]),
          }}
        />
        <ProductDetailView
          product={product}
          relatedProducts={relatedProducts}
          brand={brand}
          categoryAncestors={categoryAncestors}
        />
      </>
    );
  }

  // 2. Kiểm tra Trang Danh mục (ĐÃ SỬA LỖI ANY THÀNH ĐỐI TƯỢNG CHUẨN)
  const category = await categoryRepository.getBySlug(slug);

  if (category) {
    const defaultPagination: PaginationMeta = {
      total: 0,
      page: 1,
      limit: 40,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

    const [{ items: products, pagination }, subcategories, ancestors] =
      await Promise.all([
        productRepository
          .getByCategory(slug, { page: 1, limit: 40 })
          .catch(() => ({ items: [], pagination: defaultPagination })),
        categoryRepository.getChildren(category.id).catch(() => []),
        categoryRepository.getAncestors(category.id).catch(() => []),
      ]);

    return (
      <CategoryView
        category={category}
        products={products}
        pagination={pagination}
        subcategories={subcategories}
        ancestors={ancestors}
      />
    );
  }

  // 3. Kiểm tra Trang Thương hiệu
  const brand = await brandRepository.getBySlug(slug);

  if (brand) {
    const { items: products, pagination } = await productRepository.list(
      { tags: [] },
      undefined,
      {
        page: 1,
        limit: 40,
      },
    );

    const brandProducts = products.filter((p) => p.brandId === brand.id);

    return (
      <BrandView
        brand={brand}
        products={brandProducts}
        pagination={{
          ...pagination,
          total: brandProducts.length,
          totalPages: 1,
          hasNext: false,
        }}
      />
    );
  }

  notFound();
}
