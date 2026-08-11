import type { Metadata } from "next";
import { MainHorizontalScroll } from "@/components/home/main-horizontal-scroll";
import {
  blogRepository,
  categoryRepository,
  productRepository,
} from "@/lib/repositories"; // Tên import đã được điều chỉnh chuẩn xác
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Boo Space — Custom 3D Printed Workspace & Design Studio",
  description:
    "Boo Space cung cấp sản phẩm in 3D theo yêu cầu cho workspace và DIY. Thiết kế tùy chỉnh, sản xuất theo ý tưởng riêng và tạo ra các giải pháp không gian làm việc độc đáo bằng chất liệu CR-PETG cao cấp.",
  alternates: {
    canonical: "https://www.boospace.tech/",
  },
  openGraph: {
    title: "Boo Space — Custom 3D Printed Workspace",
    description:
      "Thiết kế và sản xuất sản phẩm in 3D cho workspace và DIY theo yêu cầu tại Boo Space.",
    type: "website",
    url: "https://www.boospace.tech/",
  },
};

// Đặt revalidate = 0 để tự động làm mới dữ liệu từ Supabase ngay lập tức khi F5
export const revalidate = 0;

// Bộ chuyển đổi sản phẩm từ Supabase CSDL
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
      quantity: dbProduct.stock ?? 0,
      allowBackorder: false,
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
    stock: dbProduct.stock ?? 0,
    tags: [],
    variants: [defaultVariant],
    createdAt: dbProduct.created_at || new Date().toISOString(),
    updatedAt: dbProduct.updated_at || new Date().toISOString(),
  };
}

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  // NẠP ĐỒNG THỜI TOÀN BỘ CÁC BẢNG TỪ SUPABASE DATABASE
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

  // Ánh xạ sản phẩm ưu đãi
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saleProducts = (saleProductsRes.data || [])
    .map(mapDbProductToStorefront)
    .filter((p) => p !== null);

  // GỘP CẢ 2 BẢNG HỒ SƠ CONFIG VÀ HOMEPAGE TỪ SUPABASE
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
