import type { Metadata } from "next";
import { MainHorizontalScroll } from "@/components/home/main-horizontal-scroll";
import { siteConfig } from "@/lib/config";
import {
  blogRepository,
  categoryRepository,
  productRepository,
} from "@/lib/repositories";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Boo Space — Không Gian Sống & Thiết Kế Độc Bản",
  description:
    "Boo Space tạo ra những tác phẩm thiết kế tối giản, ấm áp cho góc làm việc và không gian sống. Đèn ambient khúc xạ ánh sáng, chậu cây tự tưới và phụ kiện bàn làm việc độc bản.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Boo Space — Không Gian Sống & Thiết Kế Độc Bản",
    description:
      "Boo Space tạo ra những tác phẩm thiết kế tối giản, ấm áp cho góc làm việc và không gian sống.",
    type: "website",
    url: siteConfig.url,
  },
};

export const revalidate = 0;

// BỘ CHUYỂN ĐỔI SẢN PHẨM KHỚP 100% VỚI KIỂU DỮ LIỆU Product
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbProductToStorefront(dbProduct: any): Product | null {
  if (!dbProduct) return null;

  const price = Number(dbProduct.price ?? 0) * 100;
  const comparePrice = dbProduct.compare_price
    ? Number(dbProduct.compare_price) * 100
    : null;

  const defaultVariant = {
    id: `${dbProduct.id}-default`,
    productId: dbProduct.id,
    sku: dbProduct.sku || "",
    name: "Default Variant",
    price: price,
    compareAtPrice: comparePrice,
    currency: "VND",
    inventory: {
      quantity: dbProduct.stock ?? 0,
      trackInventory: true,
      allowBackorder: false,
    },
    options: [],
    images: [],
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
    status: dbProduct.published ? ("active" as const) : ("draft" as const),
    featured: Boolean(dbProduct.featured),
    images: mappedImages,
    categoryIds: dbProduct.category_id ? [dbProduct.category_id] : [],
    brandId: dbProduct.brand_id || "",
    stock: dbProduct.stock ?? 0,
    thumbnail_url: dbProduct.thumbnail_url || null,
    video_url: dbProduct.video_url || null,
    tags: [],
    variants: [defaultVariant],
    // 🌟 ĐÃ BỔ SUNG rating VÀ reviewCount ĐỂ KHỚP 100% VỚI KIỂU Product
    rating: Number(dbProduct.rating ?? 5),
    reviewCount: Number(dbProduct.review_count ?? 0),
    createdAt: dbProduct.created_at || new Date().toISOString(),
    updatedAt: dbProduct.updated_at || new Date().toISOString(),
  } as unknown as Product;
}

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const [
    categories,
    featuredResult,
    blogsResult,
    siteConfigRes,
    homepageRes,
    saleProductsRes,
  ] = await Promise.all([
    categoryRepository.list(),
    productRepository.getFeatured(8),
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
      .limit(8),
  ]);

  const blogs = blogsResult?.items || [];

  // ÁNH XẠ SẢN PHẨM KHUYẾN MÃI THEO KIỂU Product[]
  const saleProducts: Product[] = (saleProductsRes.data || [])
    .map(mapDbProductToStorefront)
    .filter((p): p is Product => p !== null);

  const config = {
    ...(homepageRes.data?.value || {}),
    ...(siteConfigRes.data?.value || {}),
  };

  return (
    <MainHorizontalScroll
      categories={categories}
      featuredProducts={featuredResult}
      saleProducts={saleProducts}
      blogs={blogs}
      config={config}
    />
  );
}
