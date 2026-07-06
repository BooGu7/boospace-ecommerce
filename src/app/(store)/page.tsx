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

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  // TRUY VẤN DỮ LIỆU THỜI GIAN THỰC TỪ SUPABASE ĐỒNG BỘ [18]
  const [categories, featuredProducts, blogsResult, settingsRes] =
    await Promise.all([
      categoryRepository.list(),
      productRepository.getFeatured(4),
      blogRepository.list({ page: 1, limit: 3 }),
      supabase
        .from("settings")
        .select("value")
        .eq("key", "homepage")
        .maybeSingle(),
    ]);

  const blogs = blogsResult?.items || [];

  // Đọc cấu hình từ trường JSONB của database [21]
  const config = settingsRes?.data?.value || {
    hero_title: "A Shopping Experience, De-congested.",
    hero_subtitle:
      "Không còn vòng xoay tải trang. Không còn giật lag khi thanh toán. Được vận hành bởi kiến trúc Realtime của Supabase.",
    hero_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/hero-desk-setup.jpg",
    diy_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/diy-collection.jpg",
    tech_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/tech-collection.jpg",
    hero_video:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/workspace-video.mp4",

    statement_title:
      "Chúng tôi từ chối chấp nhận một không gian làm việc bừa bộn, kém bảo mật, và gây xao nhãng.",
    statement_subtitle: "02 / TUYÊN NGÔN BOOSPACE",

    display_tag: "// CHẾ TÁC VÀ ĐỒNG BỘ ĐỘC BẢN",
    display_title: "Hệ sinh thái bàn làm việc hướng tới sự tập trung sâu",
    display_spec_1_val: "0.1s",
    display_spec_1_lbl: "Độ chính xác trong từng khớp nối in 3D kỹ thuật cao.",
    display_spec_2_val: "🔒 RLS",
    display_spec_2_lbl:
      "Thiết kế giấu dây cáp gọn gàng và bảo mật thông tin tối đa.",
    display_spec_3_val: "🔄 100%",
    display_spec_3_lbl:
      "Đồng bộ giỏ hàng và thanh toán mượt mà thời gian thực.",

    scroll_slide_1_title: "Sờ chạm thô mộc của thớ gỗ sồi sấy.",
    scroll_slide_1_desc:
      "Gỗ tự nhiên sấy lò được mài nhám mịn bằng tay và phủ lớp dầu bảo dưỡng hữu cơ mộc mạc, kết nối tâm trí của bạn với tự nhiên ngay tại bàn phím số.",
    scroll_slide_2_title: "Giải phóng không gian sáng tạo.",
    scroll_slide_2_desc:
      "Rãnh âm giấu cáp thông minh dọn dẹp sạch sẽ đống dây lộn xộn trên bàn làm việc, tạo khoảng không tối giản tĩnh lặng tuyệt đối cho sự tập trung sâu.",
    scroll_slide_3_title: "Thiết kế công thái học bảo vệ cơ thể.",
    scroll_slide_3_desc:
      "Nâng màn hình lên độ cao 15 độ lý tưởng vừa tầm mắt, giúp điều chỉnh tư thế ngồi thẳng tự nhiên, giảm thiểu mệt mỏi lên vùng cổ và vai gáy.",

    manifesto_quote:
      "Boospace hoạt động trên nền tảng mã nguồn mở độc lập, cam kết mã hóa và bảo vệ dữ liệu cá nhân của bạn thông qua hạ tầng phi tập trung của Supabase.",
  };

  return (
    <MainHorizontalScroll
      categories={categories}
      featuredProducts={featuredProducts}
      blogs={blogs}
      config={config}
    />
  );
}
