import type { Metadata } from "next";
import { MainHorizontalScroll } from "@/components/home/main-horizontal-scroll";
import { siteConfig } from "@/lib/config";
import {
  blogRepository,
  categoryRepository,
  productRepository,
} from "@/lib/repositories";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Custom 3D Printed Workspace & DIY Design Studio`,
  description:
    "Boo Space cung cấp giải pháp chế tác On-Demand cho workspace và góc làm việc tối giản. Thiết kế tùy chỉnh, sản xuất theo ý tưởng riêng bằng chất liệu kỹ thuật cao cấp.",
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
  openGraph: {
    title: `${siteConfig.name} — Custom 3D Printed Workspace`,
    description:
      "Thiết kế và sản xuất sản phẩm cho workspace và DIY theo yêu cầu tại Boo Space.",
    type: "website",
    url: `${siteConfig.url}/`,
  },
  keywords: [
    "3d printed workspace",
    "custom 3d print",
    "3d printing service",
    "workspace accessories",
    "custom desk setup",
    "boo space",
    "boo space tech",
  ],
};

export const revalidate = 600;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbProductToStorefront(dbProduct: any) {
  if (!dbProduct) return null;

  const price = Number(dbProduct.price ?? 0) * 100;
  const comparePrice = dbProduct.compare_price
    ? Number(dbProduct.compare_price) * 100
    : null;

  const defaultVariant = {
    id: `${dbProduct.id}-default`,
    name: "Default Variant",
    sku: dbProduct.sku || "",
    price: price,
    compareAtPrice: comparePrice,
    inventory: {
      quantity: dbProduct.stock ?? 99,
      allowBackorder: true,
    },
  };

  const dbImages = dbProduct.images || [];
  const mappedImages = dbImages.map((url: string, index: number) => ({
    id: `${dbProduct.id}-img-${index}`,
    url: url,
    alt: dbProduct.name,
  }));

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description || "",
    shortDescription: dbProduct.short_description || "",
    status: dbProduct.published ? "active" : "draft",
    featured: dbProduct.featured || false,
    images: mappedImages,
    categoryIds: dbProduct.category_id ? [dbProduct.category_id] : [],
    brandId: dbProduct.brand_id,
    tags: [],
    variants: [defaultVariant],
    createdAt: dbProduct.created_at || new Date().toISOString(),
    updatedAt: dbProduct.updated_at || new Date().toISOString(),
  };
}

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const [
    categories,
    featuredProducts,
    blogsResult,
    siteConfigRes,
    homepageRes,
    saleProductsRes,
  ] = await Promise.all([
    categoryRepository.list(),
    productRepository.getFeatured(4),
    blogRepository.list({ page: 1, limit: 3 }),
    supabase
      .from("settings")
      .select("value")
      .eq("key", "site_config")
      .maybeSingle(),
    supabase
      .from("settings")
      .select("value")
      .eq("key", "homepage")
      .maybeSingle(),
    supabase
      .from("products")
      .select("*")
      .not("compare_price", "is", null)
      .eq("published", true)
      .limit(4),
  ]);

  const blogs = blogsResult?.items || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saleProducts = (saleProductsRes.data || [])
    .map(mapDbProductToStorefront)
    .filter((p): p is any => p !== null);

  const homepageVal = homepageRes?.data?.value || {};
  const siteConfigVal = siteConfigRes?.data?.value || {};

  // 100% LẤY HÌNH ẢNH MẶC ĐỊNH TỪ SUPABASE STORAGE CỦA DỰ ÁN
  const fallbackConfig = {
    hero_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/hero-desk-setup.jpg",
    diy_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/diy-collection.jpg",
    tech_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/tech-collection.jpg",
    hero_video:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/co-creation-files/hero-ambient.mp4",
  };

  const config = {
    ...fallbackConfig,
    ...homepageVal,
    ...siteConfigVal,
  };

  return (
    <MainHorizontalScroll
      categories={categories}
      featuredProducts={featuredProducts}
      saleProducts={saleProducts}
      blogs={blogs}
      config={config}
    />
  );
}
