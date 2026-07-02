import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Heart,
  Leaf,
  Zap,
  Eye,
  Cpu,
  Layers,
  Settings,
  Monitor,
  Award,
  Globe,
  CheckCircle2,
  Play,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import {
  productRepository,
  categoryRepository,
  blogRepository,
} from "@/lib/repositories";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// CẤU HÌNH SEO METADATA CHUẨN CỦA BẠN
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

  // Lấy dữ liệu thật từ các Repository và bảng settings của Supabase song song [18]
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

  // Khởi tạo cơ chế dự phòng (Fallbacks) chuẩn xác phong cách Daylight [1.1]
  const config = settingsRes?.data?.value || {
    hero_title: "Tools made for deep focus.",
    hero_subtitle:
      "Chúng tôi chế tác các phụ kiện gỗ tự nhiên và giải pháp in 3D tối giản nhằm giảm bớt sự xao lãng kỹ thuật số, mang lại xúc giác mộc mạc và trả lại sự tập trung thuần khiết cho góc làm việc của bạn.",
    hero_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/hero-desk-setup.jpg",
    diy_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/diy-collection.jpg",
    tech_image:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/tech-collection.jpg",
    hero_video:
      "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/workspace-video.mp4",
  };

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] antialiased min-h-screen selection:bg-[#EAE5D9]">
      {/* SECTION 1: HERO SCREEN (Tối giản & Trực quan - Khớp 100% Ảnh 1) [1.1] */}
      <section
        className="relative min-h-[90vh] flex items-stretch border-b border-[#E1DDD5] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${config.hero_image})` }}
      >
        {/* Lớp phủ tối mờ nghệ thuật để làm nổi bật văn bản */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="mx-auto max-w-[1440px] w-full flex flex-col justify-between relative z-10 p-6 sm:p-12 lg:p-16 text-white bg-black/5">
          {/* Header phụ nhỏ gọn (Góc trên bên phải - Ảnh 1) */}
          <div className="flex justify-between items-start w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FAF5F2] text-xs font-mono uppercase tracking-widest border border-white/20">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              SOL SERIES INITIATIVE
            </div>

            {/* Khối nổi "Meet Boospace Kids" (Góc trên bên phải) */}
            <div className="hidden sm:block max-w-xs bg-white/95 backdrop-blur-md text-black p-4 rounded-2xl border border-white/20 shadow-xl relative overflow-hidden group">
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#FF9D00] text-black text-[9px] font-mono font-bold uppercase rounded-md">
                LIMITED
              </span>
              <div className="space-y-1 pr-6">
                <h4 className="font-bold text-sm">Meet Boospace Kids</h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  WOODEN DIY KITS INCLUDED
                </p>
                <Link
                  href="/shop"
                  className="text-[10px] text-blue-600 font-bold hover:underline block pt-1"
                >
                  TAKE A PEEK ↗
                </Link>
              </div>
            </div>
          </div>

          {/* Tiêu đề & Mô tả Hero (Giữa - Ảnh 1) */}
          <div className="max-w-2xl space-y-6 pt-16">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05] font-serif text-drop-shadow">
              The workspace,
              <br />
              <span className="text-[#FF9D00] italic font-medium font-serif">
                de-invented.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-lg font-sans text-drop-shadow">
              {config.hero_subtitle}
            </p>
          </div>

          {/* Chân trang Hero (Khung Video, Newsletter, Button Order - Ảnh 1) */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8 pt-12">
            {/* Khung phát Video lặp lại thời gian thực từ Supabase Storage [1.1, 21] */}
            <div className="relative w-48 sm:w-64 aspect-[16/10] rounded-2xl overflow-hidden border-2 border-[#FF9D00] bg-black/40 group cursor-pointer shadow-lg">
              <video
                src={config.hero_video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Cụm CTA bên phải (Newsletter & Button Order) */}
            <div className="space-y-4 max-w-sm w-full">
              {/* Form Newsletter nhỏ gọn */}
              <div className="bg-white/95 backdrop-blur-md text-black p-4 rounded-2xl border border-white/20 shadow-xl relative">
                <span className="absolute top-2 right-2 text-xs text-slate-400 cursor-pointer hover:text-black">
                  ✕
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-800">
                    Newsletter
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    GET UPDATES · NO SPAM
                  </p>
                </div>
              </div>

              {/* Lệnh Order Now khổng lồ */}
              <div className="space-y-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[#1E1C1A] hover:bg-[#33302C] text-[#FCFAF2] rounded-xl py-4 font-mono uppercase text-xs font-bold tracking-wider transition-all border border-[#1E1C1A]"
                >
                  <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2"
                  >
                    ORDER NOW
                  </Link>
                </Button>
                <p className="text-center text-[10px] text-white/70 font-mono tracking-wider">
                  ✓ IN STOCK · SHIPS IN 3-5 BUSINESS DAYS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE STATEMENT (Tối giản hoàn toàn - Ảnh 2) [1.1] */}
      <section className="bg-white py-24 sm:py-36 border-b border-[#E1DDD5] px-4 text-center">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal font-serif leading-tight tracking-tight text-black max-w-4xl mx-auto">
            We refuse to accept a future where our devices are{" "}
            <span className="text-[#FF9D00] italic font-serif">exhausting</span>
            ,{" "}
            <span className="text-[#FF9D00] italic font-serif">addictive</span>,
            and{" "}
            <span className="text-[#FF9D00] italic font-serif">
              distracting.
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-widest mt-12">
            02 / THE BOOSPACE MANIFESTO
          </p>
        </div>
      </section>

      {/* SECTION 3: THE DISPLAY (Khớp 100% Ảnh 3) [1.1] */}
      <section
        className="relative min-h-[90vh] flex items-stretch border-b border-[#E1DDD5] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${config.diy_image})` }}
      >
        {/* Lớp phủ mờ */}
        <div className="absolute inset-0 bg-black/25 z-0" />

        <div className="mx-auto max-w-[1440px] w-full flex flex-col justify-between relative z-10 p-8 sm:p-12 lg:p-16 text-white bg-black/10">
          <div className="max-w-2xl pt-12 space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              // SOLID HARDWOODS
            </span>
            <h2 className="text-4xl sm:text-6xl font-normal font-serif leading-tight text-drop-shadow">
              The world’s first <br />
              <span className="italic font-serif text-[#FF9D00]">
                focus-driven
              </span>{" "}
              desk setup
            </h2>
          </div>

          {/* 3 cột trạng thái kỹ thuật (Specs Pips ở chân trang - Ảnh 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/20">
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Sparkles className="size-4 text-[#FF9D00]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Chế tác thủ công</h4>
                <p className="text-xs text-white/70 leading-normal">
                  Chà nhám và hoàn thiện bằng tay mộc mạc tỉ mỉ
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <ShieldCheck className="size-4 text-[#FF9D00]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Không xao nhãng</h4>
                <p className="text-xs text-white/70 leading-normal">
                  Thiết kế giấu dây cáp và loại bỏ chi tiết thừa
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Heart className="size-4 text-[#FF9D00]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Bảo vệ sức khỏe</h4>
                <p className="text-xs text-white/70 leading-normal">
                  Công thái học 15 độ bảo vệ cột sống cổ và mắt
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DIVE DEEPER (Khối Bento phấn trắng trên bảng đen - Ảnh 4) [1.1] */}
      <section className="bg-[#111111] text-white py-24 sm:py-32 border-b border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Tiêu đề bên trái */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex gap-1.5 text-amber-500 font-mono text-xs">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-normal font-serif leading-tight">
                Refine your <br />
                creative flow
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xs leading-relaxed">
                Khám phá sâu hơn từng phân khu thiết kế để tìm kiếm phụ kiện
                hoàn hảo cho góc làm việc của bạn.
              </p>
            </div>

            {/* 4 Thẻ Technical Icon (Ảnh 4) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: "PRODUCT", desc: "Sản phẩm", icon: Cpu },
                  { name: "SPECS", desc: "Thông số", icon: Layers },
                  { name: "FAQ", desc: "Hỏi đáp", icon: HelpCircle },
                  { name: "SUPPORT", desc: "Hỗ trợ", icon: ShieldCheck },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="group aspect-[252/325] bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 hover:border-[#FF9D00] transition-all cursor-pointer"
                    >
                      <div className="flex-1 flex items-center justify-center my-4 group-hover:scale-105 transition-transform duration-500">
                        {/* Technical outline drawing */}
                        <div className="relative size-20 text-white/50 group-hover:text-[#FF9D00] transition-colors">
                          <Icon className="w-full h-full stroke-[1.2]" />
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                        <span className="font-mono text-xs text-white/80 tracking-wider group-hover:text-[#FF9D00]">
                          {item.name} →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS (Xếp chồng bất đối xứng - Ảnh 5) [1.1] */}
      <section className="bg-[#1C1A18] py-28 sm:py-36 border-b border-[#E1DDD5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FAF5F2_1px,transparent_1px),linear-gradient(to_bottom,#FAF5F2_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Tiêu đề nền siêu lớn */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-6xl sm:text-8xl font-bold font-serif text-[#FAF5F2]/5 uppercase leading-none select-none">
              What <br /> creators <br /> say
            </h2>
          </div>

          {/* Lưới các thẻ phản hồi xếp chồng */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  name: "Akshay Kothari",
                  role: "Co-Founder @NotionHQ",
                  avatar: "https://placehold.co/100x100?text=AK",
                  quote:
                    "“It’s the only computer and workspace setup I feel comfortable sharing with my kids!”",
                  bg: "bg-[#272819]/90 border-[#FF9D00]/20",
                },
                {
                  name: "Waqas Ali",
                  role: "Founder @Atoms",
                  avatar: "https://placehold.co/100x100?text=WA",
                  quote:
                    "“Daylight and Boospace get it, bringing simplicity and focus back to our digital and physical life.”",
                  bg: "bg-[#272819]/90 border-[#FF9D00]/20",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border text-white backdrop-blur-md shadow-xl flex flex-col justify-between h-56 ${card.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-full overflow-hidden border-2 border-[#FF9D00]">
                      <Image
                        src={card.avatar}
                        alt={card.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{card.name}</h4>
                      <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                        {card.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-serif italic text-neutral-200 mt-4 leading-relaxed">
                    {card.quote}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-4 block border-t border-white/10 pt-2 font-mono">
                    Verified Creator • 2026
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: PRODUCT PORTFOLIO */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 border-b border-[#E1DDD5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b pb-6 border-[#E1DDD5] mb-12">
          <div>
            <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest">
              04 / THE CORE PORTFOLIO
            </span>
            <h2 className="text-4xl font-normal text-black font-serif mt-2">
              The Wood Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-[#FF9D00] flex items-center gap-1.5 transition-colors"
          >
            Xem toàn bộ kho hàng →
          </Link>
        </div>

        {/* TẬN DỤNG PRODUCTGRID HOẠT ĐỘNG CHUẨN XÁC CỦA BẠN */}
        <div className="mt-8">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* SECTION 7: SUNSET PRE-FOOTER BANNER (Bản hiệu chuẩn chuyển tiếp mượt mà - Tránh lặp Footer gốc) [1.1] */}
      <section className="relative text-white bg-black py-28 overflow-hidden border-t border-black">
        {/* Glow cam hoàng hôn rực rỡ phía trên */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-gradient-radial from-[#FF8A00]/15 to-transparent blur-3xl -translate-y-[80%] pointer-events-none" />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-white/10 pb-16">
            <div className="space-y-4 text-left">
              <h3 className="text-3xl sm:text-5xl font-normal font-serif leading-none">
                The workspace, de-invented
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono uppercase tracking-widest">
                Ships within 3-5 business days
              </p>
            </div>
            <div className="w-full lg:w-72 shrink-0">
              <Button
                asChild
                size="lg"
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black rounded-xl py-4 font-mono uppercase text-xs font-bold tracking-wider transition-all border border-[#FF9D00] shadow-lg"
              >
                <Link href="/shop">ORDER NOW</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
