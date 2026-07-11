import type { Metadata } from "next";
import {
  productRepository,
  categoryRepository,
  blogRepository,
} from "@/lib/repositories";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// IMPORT COMPONENT ĐIỀU PHỐI TRƯỢT NGANG TOÀN TRANG
import { MainHorizontalScroll } from "@/components/home/main-horizontal-scroll";

// GIỮ NGUYÊN TOÀN BỘ CẤU HÌNH SEO METADATA CHUẨN CỦA BẠN
export const metadata: Metadata = {
  title: "Boospace — Custom 3D Printed Workspace & DIY Design Studio",
  description:
    "Boospace cung cấp sản phẩm in 3D theo yêu cầu cho workspace và DIY. Thiết kế tùy chỉnh, sản xuất theo ý tưởng riêng và tạo ra các giải pháp không gian làm việc độc đáo bằng công nghệ in 3D.",
  alternates: {
    canonical: "https://boospace.tech/",
  },
  openGraph: {
    title: "Boospace — Custom 3D Printed Workspace",
    description:
      "Thiết kế và sản xuất sản phẩm in 3D cho workspace và DIY theo yêu cầu tại Boospace.",
    type: "website",
    url: "https://boospace.tech/",
  },
  keywords: [
    "3d printed workspace",
    "custom 3d print",
    "3d printing service",
    "workspace accessories",
    "custom desk setup",
    "diy 3d print",
    "boospace",
    "boospace tech",
  ],
};

export const revalidate = 0; // Đảm bảo luôn lấy dữ liệu mới nhất từ Supabase khi F5

// BỘ CHUYỂN ĐỔI DỮ LIỆU ĐỂ MAP HÌNH ẢNH SẢN PHẨM KHÔNG BỊ LỖI
function mapDbProductToStorefront(dbProduct: any) {
  if (!dbProduct) return null;

  const price = Number(dbProduct.price ?? 0) * 100;
  const comparePrice = dbProduct.compare_price
    ? Number(dbProduct.compare_price) * 100
    : null;

  const defaultVariant = {
    id: dbProduct.id + "-default",
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

  // TRUY VẤN DỮ LIỆU ĐỒNG THỜI TỪ SUPABASE
  const [
    categories,
    featuredProducts,
    blogsResult,
    settingsRes,
    saleProductsRes,
  ] = await Promise.all([
    categoryRepository.list(),
    productRepository.getFeatured(4),
    blogRepository.list({ page: 1, limit: 3 }),
    supabase
      .from("settings")
      .select("value")
      .eq("key", "homepage")
      .maybeSingle(),
    // TRUY VẤN ĐỘNG: Lấy ra các sản phẩm đang giảm giá thực tế (compare_price không null) [21]
    supabase
      .from("products")
      .select("*")
      .not("compare_price", "is", null)
      .eq("published", true)
      .limit(4),
  ]);

  const blogs = blogsResult?.items || [];

  // Ánh xạ danh sách sản phẩm giảm giá chuẩn cấu hình storefront
  const saleProducts = (saleProductsRes.data || [])
    .map(mapDbProductToStorefront)
    .filter((p) => p !== null);

  const config = settingsRes?.data?.value || {
    hero_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/hero-desk-setup.jpg",
    diy_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/diy-collection.jpg",
    tech_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/tech-collection.jpg",
    hero_video:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/workspace-video.mp4",
    manifesto_quote:
      "Boospace hoạt động trên nền tảng chế tác thủ công mộc mạc và mã nguồn mở độc lập, bảo vệ tuyệt đối sự tĩnh lặng và dữ liệu cá nhân của bạn thông qua hạ tầng phi tập trung của Supabase.",
  };

  return (
    <MainHorizontalScroll
      categories={categories}
      featuredProducts={featuredProducts}
      saleProducts={saleProducts} // Truyền dải sản phẩm giảm giá động xuống client scroller [21]
      blogs={blogs}
      config={config}
    />
  );
}
