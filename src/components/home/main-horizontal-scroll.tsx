"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import { BentoPortalGrid } from "./bento-portal-grid";
import { HeroVideoSection } from "./hero-video-section";

interface MainHorizontalScrollProps {
  categories: any[];
  featuredProducts: any[];
  blogs: any[];
  config: any;
}

// Cấu hình Hoạt ảnh chuyển động vi mô dạng tĩnh (Type-safe Variants)
const textFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const imageParallax: Variants = {
  hidden: { scale: 1.05, opacity: 0.9 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

export function MainHorizontalScroll({
  categories,
  featuredProducts,
  blogs,
  config,
}: MainHorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // XỬ LÝ LỖI MẤT GIAO DIỆN KHI BẤM NÚT "BACK" CỦA TRÌNH DUYỆT (Scroll Restoration Bug)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalScrollRestoration = window.history.scrollRestoration;

      // Buộc trình duyệt không tự động cuộn cưỡng bức trước khi React hoàn tất đo đạc Layout
      window.history.scrollRestoration = "manual";

      // Đưa trang về vị trí đầu mượt mà
      window.scrollTo(0, 0);

      return () => {
        // Trả lại trạng thái khôi phục cuộn tự động cho các trang khác (/shop, /blog...)
        window.history.scrollRestoration = originalScrollRestoration;
      };
    }
  }, []);

  // Theo dõi tiến trình cuộn dọc trong tầm h-scroll 900vh (tương ứng 10 slide)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tạo mượt đường cuộn (Smooth Scrolling Spring)
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
  });

  // Tịnh tiến 10 slide rộng 100vw xếp cạnh nhau (1000vw) -> dịch chuyển tối đa -90%
  const x = useTransform(smoothScrollProgress, [0, 1], ["0%", "-90%"]);

  // Thanh tiến trình cuộn ngang (Scroll Progress Bar) đặt ở đầu trang Desktop
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* ============================================================================
         1. THIẾT BỊ DI ĐỘNG (MOBILE LAYOUT): Dàn dọc mượt mà, đan xen màu sắc sáng/tối
         ============================================================================ */}
      <div className="block md:hidden space-y-16 bg-[#FCFAF2] text-[#1E1C1A]">
        {/* Slide 1: Hero Section */}
        <HeroVideoSection
          heroImage={config.hero_image}
          heroVideo={config.hero_video}
          heroSubtitle="Một trải nghiệm tĩnh lặng, dọn dẹp mọi xao nhãng. Không còn vòng xoay tải trang vô tận, không còn tiếng ồn số. Chỉ có sự mộc mạc của chất liệu vật lý kết hợp cùng hạ tầng Realtime mượt mà."
        />

        {/* Slide 2: Tuyên ngôn */}
        <section className="bg-[#F7F4EB] py-20 px-6 text-center border-y border-[#E1DDD5]">
          <h2 className="text-3xl font-light font-serif leading-relaxed tracking-tight text-[#1E1C1A] max-w-4xl mx-auto">
            Chúng tôi từ chối chấp nhận một tương lai nơi các thiết bị làm ta
            kiệt sức, gây nghiện và bủa vây bởi sự{" "}
            <span className="text-[#E26E67] font-semibold">
              xao nhãng<sup className="text-xs text-[#FF9D00] ml-0.5">1</sup>
            </span>
          </h2>
          <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest mt-8 font-bold">
            TUYÊN NGÔN BOOSPACE
          </p>
        </section>

        {/* Slide 3: Chạm thô mộc */}
        <section className="px-6 py-16 space-y-6">
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
            CHẠM THÔ MỘC
          </span>
          <h2 className="text-3xl font-bold font-serif text-black leading-tight">
            Cảm giác sờ chạm thô mộc từ thớ gỗ sồi sấy
          </h2>
          <p className="text-sm text-[#5C564E] leading-relaxed">
            Gỗ tự nhiên được mài nhám mịn bằng tay và nâng niu bằng lớp dầu bảo
            dưỡng hữu cơ mộc mạc, kết nối sâu sắc tâm trí bạn với tự nhiên ngay
            tại bàn phím.
          </p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white">
            <Image
              src={config.diy_image}
              alt="Chạm thô mộc"
              fill
              sizes="100vw"
              className="object-cover mix-blend-multiply opacity-95"
            />
          </div>
        </section>

        {/* Slide 4: Tránh xao nhãng (Dark Panel) */}
        <section className="px-6 py-16 bg-[#1C1A18] text-[#FCFAF2] space-y-6 border-y border-[#E1DDD5]/10">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
            TRÁNH XAO NHÃNG
          </span>
          <h2 className="text-3xl font-bold font-serif text-white leading-tight">
            Giải phóng không gian cho sự tập trung sâu
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Rãnh âm giấu cáp thông minh dọn dẹp sạch sẽ đống dây lộn xộn trên
            bàn làm việc, trả lại khoảng không tối giản tĩnh lặng tuyệt đối cho
            những ý tưởng lớn.
          </p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900">
            <Image
              src={config.tech_image}
              alt="Tránh xao nhãng"
              fill
              sizes="100vw"
              className="object-cover opacity-90"
            />
          </div>
        </section>

        {/* Slide 5: Công thái học */}
        <section className="px-6 py-16 space-y-6">
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
            CÔNG THÁI HỌC
          </span>
          <h2 className="text-3xl font-bold font-serif text-black leading-tight">
            Tư thế ngồi tự nhiên, bảo vệ năng lượng sống
          </h2>
          <p className="text-sm text-[#5C564E] leading-relaxed">
            Nâng màn hình lên góc 15 độ lý tưởng, giải phóng áp lực lên vùng vai
            gáy, giúp bạn duy trì trạng thái sáng tạo bền bỉ suốt cả ngày dài.
          </p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white">
            <Image
              src={config.hero_image}
              alt="Công thái học"
              fill
              sizes="100vw"
              className="object-cover mix-blend-multiply opacity-95"
            />
          </div>
        </section>

        {/* Slide 6: Featured Products */}
        <section className="px-6 py-16 bg-[#F5F1E6] border-y border-[#E1DDD5]">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
            <h2 className="text-3xl font-normal text-black font-serif">
              Thiết kế nổi bật
            </h2>
            <Link
              href="/shop"
              className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-[#FF9D00]"
            >
              Xem tất cả →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        {/* Slide 7: Collections */}
        <section className="px-6 py-16">
          <h2 className="text-3xl font-normal text-black font-serif border-b pb-4 border-[#E1DDD5] mb-8">
            Không gian module
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {categories?.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-square rounded-3xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/40 shadow-sm"
              >
                <Image
                  src={
                    idx === 0
                      ? config.diy_image
                      : idx === 1
                        ? config.tech_image
                        : config.hero_image
                  }
                  alt={cat.name}
                  fill
                  sizes="100vw"
                  className="object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    MÔ HÌNH 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-bold font-serif">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Slide 8: The Journal */}
        <section className="px-6 py-16 bg-[#F9F6ED] border-y border-[#E1DDD5]">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
            <h2 className="text-3xl font-normal text-black font-serif">
              The Journal
            </h2>
            <Link
              href="/blog"
              className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-amber-600"
            >
              Xem nhật ký →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {blogs?.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="space-y-3"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E1DDD5]">
                  <Image
                    src={
                      post.coverImage?.url ||
                      "https://placehold.co/800x400/e2dcd5/7a736e?text=Boospace+Blog"
                    }
                    alt={post.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg font-serif text-black">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Slide 9: Bento Grid */}
        <section className="px-6 py-16">
          <div className="border-b pb-4 border-[#E1DDD5] mb-8">
            <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
              STRUCTURAL ANATOMY
            </span>
            <h2 className="text-3xl font-normal text-black font-serif mt-2">
              Bento Cổng Tương Tác
            </h2>
          </div>
          <BentoPortalGrid />
        </section>

        {/* Slide 10: Sunset Pre-footer (Tương thích lưới ma trận trên di động) */}
        <section
          className="relative text-white py-20 overflow-hidden border-t border-white/5"
          style={{
            backgroundColor: "#151513",
            backgroundImage:
              "radial-gradient(circle, #2d2d2a 1px, transparent 1.2px)",
            backgroundSize: "4px 4px",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-gradient-radial from-[#FF8A00]/15 to-transparent blur-3xl -translate-y-[80%]" />
          <div className="px-6 relative z-10 text-center space-y-6">
            <h3 className="text-xl font-serif italic leading-relaxed text-white/95">
              &quot;Boospace hoạt động trên nền tảng chế tác thủ công mộc mạc và
              mã nguồn mở độc lập, bảo vệ tuyệt đối sự tĩnh lặng và dữ liệu cá
              nhân của bạn thông qua hạ tầng phi tập trung của Supabase.&quot;
            </h3>
            <Button
              asChild
              size="lg"
              className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black rounded-xl py-4 font-mono font-bold tracking-wider"
            >
              <Link href="/shop">ĐẶT CHẾ TÁC NGAY</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* ============================================================================
         2. GIAO DIỆN DESKTOP (STICKY HORIZONTAL SLIDING SCROLL): Đan xen mượt mà
         ============================================================================ */}
      <motion.div
        ref={containerRef}
        className="hidden md:block relative h-[1000vh] w-full"
      >
        {/* THANH TIẾN TRÌNH CUỘN NGANG CAO CẤP DƯỚI HEADER */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-[#FF9D00] origin-left z-50"
          style={{ scaleX }}
        />

        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          {/* Lưới kỹ thuật chạy mờ dưới nền */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E1DDD5_1px,transparent_1px),linear-gradient(to_bottom,#E1DDD5_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Dải trượt ngang 10 slide (1000vw) */}
          <motion.div
            style={{ x }}
            className="flex w-[1000vw] h-full items-center"
          >
            {/* SLIDE 1: HERO SECTION */}
            <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <HeroVideoSection
                heroImage={config.hero_image}
                heroVideo={config.hero_video}
                heroSubtitle="Một trải nghiệm tĩnh lặng, dọn dẹp mọi xao nhãng. Không còn vòng xoay tải trang vô tận, không còn tiếng ồn số. Chỉ có sự mộc mạc của chất liệu vật lý kết hợp cùng hạ tầng Realtime mượt mà."
              />
            </div>

            {/* SLIDE 2: TUYÊN NGÔN BOOSPACE (MÀU KEM SÁNG TRẦM ẤM #F7F4EB) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F7F4EB]">
              <motion.div
                variants={textFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-4xl text-center space-y-8"
              >
                <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                  SLOGAN
                </span>
                <h2 className="text-4xl lg:text-5xl font-light font-serif leading-relaxed tracking-tight text-[#1E1C1A] max-w-3xl mx-auto">
                  Chúng tôi đưa mọi nét vẽ in 3D chạm vào thế giới vật lý, phá
                  bỏ mọi ranh giới số để giải phóng sức mạnh{" "}
                  <span className="text-[#E26E67] font-bold italic">
                    sáng tạo
                    <sup className="text-xs text-[#FF9D00] ml-0.5 not-italic">
                      1
                    </sup>
                  </span>
                </h2>
              </motion.div>
            </div>

            {/* SLIDE 3: CHẠM THÔ MỘC (SÁNG) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <motion.div
                  variants={textFadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="col-span-6 space-y-6 text-left"
                >
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    HẠM THÔ MỘC
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    Cảm giác sờ chạm thô mộc từ thớ gỗ sồi sấy
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    Gỗ tự nhiên được mài nhám mịn bằng tay và nâng niu bằng lớp
                    dầu bảo dưỡng hữu cơ mộc mạc, kết nối sâu sắc tâm trí bạn
                    với tự nhiên ngay tại bàn phím.
                  </p>
                </motion.div>
                <motion.div
                  variants={imageParallax}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
                >
                  <Image
                    src={config.diy_image}
                    alt="Chạm thô mộc"
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 4: TRÁNH XAO NHÃNG (SÁNG - ĐÃ ĐỒNG BỘ ĐỒNG NHẤT) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <motion.div
                  variants={textFadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="col-span-6 space-y-6 text-left"
                >
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    TRÁNH XAO NHÃNG
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    Giải phóng không gian cho sự tập trung sâu
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    Rãnh âm giấu cáp thông minh dọn dẹp sạch sẽ đống dây lộn xộn
                    trên bàn làm việc, trả lại khoảng không tối giản tĩnh lặng
                    tuyệt đối cho những ý tưởng lớn.
                  </p>
                </motion.div>
                <motion.div
                  variants={imageParallax}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
                >
                  <Image
                    src={config.tech_image}
                    alt="Tránh xao nhãng"
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 5: CÔNG THÁI HỌC (SÁNG - ĐÃ ĐỒNG BỘ ĐỒNG NHẤT) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <motion.div
                  variants={textFadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="col-span-6 space-y-6 text-left"
                >
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    CÔNG THÁI HỌC
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    Tư thế ngồi tự nhiên, bảo vệ năng lượng sống
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    Nâng màn hình lên góc 15 độ lý tưởng, giải phóng áp lực lên
                    vùng vai gáy, giúp bạn duy trì trạng thái sáng tạo bền bỉ
                    suốt cả ngày dài.
                  </p>
                </motion.div>
                <motion.div
                  variants={imageParallax}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
                >
                  <Image
                    src={config.hero_image}
                    alt="Tư thế tự nhiên"
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 6: SẢN PHẨM NỔI BẬT (MÀU KEM SÁNG TRẦM #F5F1E6) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F5F1E6]">
              <div className="w-full max-w-7xl">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      PRODUCTS
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-normal text-black font-serif mt-2">
                      Sản phẩm nổi bật
                    </h2>
                  </div>
                  <Link
                    href="/shop"
                    className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-[#FF9D00] flex items-center gap-1.5 transition-colors"
                  >
                    Xem toàn bộ →
                  </Link>
                </div>
                <ProductGrid products={featuredProducts} />
              </div>
            </div>

            {/* SLIDE 7: BỘ SƯU TẬP KHÔNG GIAN (SÁNG #FCFAF2) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    OLLECTION
                  </span>
                  <h2 className="text-4xl font-normal text-black font-serif mt-2">
                    BỘ SƯU TẬP
                  </h2>
                </div>
                <div className="grid gap-6 grid-cols-3 bg-[#FCFAF2]">
                  {categories?.map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      whileHover={{ y: -8 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="group relative aspect-square rounded-3xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/40 shadow-sm transition-all hover:border-[#1E1C1A] block"
                      >
                        <Image
                          src={
                            idx === 0
                              ? config.diy_image
                              : idx === 1
                                ? config.tech_image
                                : config.hero_image
                          }
                          alt={cat.name}
                          fill
                          sizes="(max-width: 1200px) 33vw, 25vw"
                          className="object-cover mix-blend-multiply opacity-80 group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-8 text-white text-left">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                            MÔ HÌNH 0{idx + 1}
                          </span>
                          <h3 className="text-2xl font-bold font-serif mt-1">
                            {cat.name}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* SLIDE 8: THE JOURNAL (MÀU SÁNG TRẦM #F9F6ED) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F9F6ED]">
              <div className="w-full max-w-7xl">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      BLOG
                    </span>
                    <h2 className="text-4xl font-normal text-black font-serif mt-2">
                      BLOG
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-[#FF9D00] flex items-center gap-1.5 transition-colors"
                  >
                    Xem bài viết →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-0 border border-[#E1DDD5] bg-white divide-x divide-[#E1DDD5] rounded-3xl overflow-hidden shadow-sm">
                  {blogs?.map((post, idx) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group p-8 space-y-6 flex flex-col justify-between hover:bg-[#FAF5F2]/40 transition-colors"
                    >
                      <div className="space-y-4 text-left">
                        <div className="text-[10px] font-mono text-[#786F66]">
                          0{idx + 1} / {formatDate(post.publishedAt)}
                        </div>
                        <h3 className="font-bold text-xl text-black group-hover:text-amber-600 font-serif leading-snug transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#5C564E] line-clamp-2 leading-relaxed font-light">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/20">
                        <Image
                          src={
                            post.coverImage?.url ||
                            "https://placehold.co/800x400/e2dcd5/7a736e?text=Boospace+Blog"
                          }
                          alt={post.title}
                          fill
                          sizes="(max-width: 1200px) 33vw, 25vw"
                          className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* SLIDE 9: BENTO GRID (GÓP Ý & AI SEARCH) - ĐƯA XUỐNG CUỐI CÙNG SÁNG #FCFAF2 */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-4 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    GÓP Ý KIẾN
                  </span>
                  <h2 className="text-4xl font-normal text-black font-serif mt-2">
                    GÓP Ý KIẾN
                  </h2>
                </div>
                <BentoPortalGrid />
              </div>
            </div>

            {/* SLIDE 10: PRE-FOOTER (Sunset Banner - ĐỒNG BỘ HIỆU ỨNG MA TRẬN LƯỚI GRID GỐC CỦA BENTOPORTALGRID) */}
            <div
              className="w-[100vw] h-full shrink-0 relative flex items-center justify-center overflow-hidden border-l border-white/5"
              style={{
                backgroundColor: "#151513", // Đen nhạt graphite đồng nhất
                backgroundImage:
                  "radial-gradient(circle, #2d2d2a 1.1px, transparent 1.2px)", // Lưới ma trận pixel tinh xảo
                backgroundSize: "4px 4px", // Mật độ chấm lưới 4px đều tăm tắp
              }}
            >
              {/* Vầng sáng Amber tỏa rộng của Daylight rọi từ trên cao xuống */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-gradient-radial from-[#FF8A00]/18 to-transparent blur-3xl -translate-y-[80%]" />

              <div className="max-w-7xl px-24 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="shrink-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-full p-6 size-24">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-[#3ECF8E]"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    <circle cx="50" cy="50" r="14" fill="currentColor" />
                  </svg>
                </div>
                <div className="space-y-4 text-left flex-1 max-w-3xl">
                  <h3 className="text-2xl sm:text-3xl font-light font-serif leading-relaxed italic text-white/95">
                    &quot;Mọi ý tưởng bạn từng nghĩ ra để cuộc sống mình dễ chịu
                    hơn, Boo Space đều có thể biến thành sản phẩm thực tế cầm
                    trên tay. Tụi mình thiết kế và chế tác riêng theo đúng thói
                    quen của bạn, dẹp bỏ mọi bất tiện hằng ngày để phục vụ chuẩn
                    xác cho chính bạn.&quot;
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-4">
                    BOO SPACE • KHÔNG GIAN CỦA NHỮNG KẺ MƠ MỘNG THỰC TẾ
                  </p>
                </div>
                <div className="w-72 shrink-0">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black rounded-xl py-4 font-mono uppercase text-xs font-bold tracking-wider cursor-pointer"
                  >
                    <Link href="/contact">LIÊN HỆ NGAY</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
