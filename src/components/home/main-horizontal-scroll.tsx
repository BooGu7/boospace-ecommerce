"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import { BentoPortalGrid } from "./bento-portal-grid";
import { HeroVideoSection } from "./hero-video-section";
import { HowItWorks } from "./how-it-works"; // Nhập khẩu quy trình chế tác mới

interface MainHorizontalScrollProps {
  categories: any[];
  featuredProducts: any[];
  saleProducts: any[]; // Nhận dải sản phẩm giảm giá động từ Supabase [21]
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
  saleProducts = [],
  blogs,
  config,
}: MainHorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  // ĐỒNG BỘ LAYOUT ĐỘNG (DYNAMIC LAYOUT SCROLL):
  // Tự động kéo dãn dải trượt ngang lên 12 Slide (1200vw) nếu có sản phẩm giảm giá,
  // ngược lại tự thu gọn về 11 Slide (1100vw) nếu không cấu hình giảm giá [21].
  const hasSaleProducts = saleProducts && saleProducts.length > 0;

  const containerHeightClass = hasSaleProducts ? "h-[1200vh]" : "h-[1100vh]";
  const containerWidthClass = hasSaleProducts ? "w-[1200vw]" : "w-[1100vw]";

  // Tịnh tiến dịch chuyển: 11 Slide dịch tối đa -90.9%, 12 Slide dịch tối đa -91.66%
  const maxTranslateX = hasSaleProducts ? "-91.66%" : "-90.9%";
  const activeSlideCount = hasSaleProducts ? 11 : 10; // Slide cuối cùng nhảy sang trang /shop

  // HÀM TRƯỢT TRANG CHỦ THEO CHỈ SỐ SLIDE (UX CHUYỂN CẢNH MƯỢT MÀ)
  const scrollToSlide = (slideIndex: number) => {
    if (typeof window !== "undefined") {
      const scrollAmount = window.innerHeight * slideIndex;
      window.scrollTo({
        top: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Theo dõi tiến trình cuộn dọc
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

  const x = useTransform(smoothScrollProgress, [0, 1], ["0%", maxTranslateX]);

  // Thanh tiến trình cuộn ngang (Scroll Progress Bar) đặt ở đầu trang Desktop
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* ============================================================================
         1. THIẾT BỊ DI ĐỘNG (MOBILE LAYOUT): Dàn dọc mượt mà, tự ẩn/hiện mục Giảm Giá
         ============================================================================ */}
      <div className="block md:hidden space-y-16 bg-[#FCFAF2] text-[#1E1C1A]">
        {/* Slide 1: Hero Section */}
        <HeroVideoSection
          heroImage={config.hero_image}
          heroVideo={config.hero_video}
          heroSubtitle="Định nghĩa lại góc sống bằng những chiếc đèn nghệ thuật và vật dụng in 3D mang ngôn ngữ tối giản. Chất liệu sinh học lành tính giúp dọn dẹp mọi xao nhãng số, trả lại sự ấm áp thuần khiết cho tâm trí."
          onExploreClick={() => {
            router.push("/shop");
          }}
        />

        {/* Slide 2: Tuyên ngôn */}
        <section className="bg-[#F7F4EB] py-20 px-6 text-center border-y border-[#E1DDD5] relative overflow-hidden">
          <div className="dappled-shadow-overlay opacity-20" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-light font-serif leading-relaxed tracking-tight text-[#1E1C1A] max-w-4xl mx-auto">
              Chúng tôi từ chối chấp nhận một tương lai nơi các thiết bị làm ta{" "}
              <span className="text-[#E26E67] font-semibold italic">
                kiệt sức
              </span>
              ,{" "}
              <span className="text-[#E26E67] font-semibold italic">
                gây nghiện
              </span>{" "}
              và bủa vây bởi sự{" "}
              <span className="text-[#E26E67] font-semibold italic">
                xao nhãng
                <sup className="text-xs text-[#FF9D00] ml-0.5 not-italic">
                  1
                </sup>
              </span>
              . Boo Space tin rằng, một chiếc đèn tỏa ánh sáng dịu hay một mảng
              xanh nhỏ gọn gàng có thể là điểm tựa kéo tâm trí bạn về với sự
              bình yên.
            </h2>
            <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest mt-8 font-bold">
              TUYÊN NGÔN BOOSPACE
            </p>
          </div>
        </section>

        {/* Slide 3: Khúc xạ ấm áp */}
        <section className="px-6 py-16 space-y-6">
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
            KHÚC XẠ ẤM ÁP
          </span>
          <h2 className="text-3xl font-bold font-serif text-black leading-tight">
            Vũ điệu dịu dàng của hình khối và ánh sáng
          </h2>
          <p className="text-sm text-[#5C564E] leading-relaxed">
            Không còn những dải LED chói mắt gây mệt mỏi thị giác. Các thiết kế
            đèn in 3D của Boo Space ứng dụng cấu trúc hình học đặc biệt để khúc
            xạ ánh sáng thô thành những vầng sáng ambient dịu mát, ôm ấp không
            gian sống của bạn khi đêm về.
          </p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white">
            <Image
              src={config.diy_image}
              alt="Khúc xạ ấm áp"
              fill
              sizes="100vw"
              className="object-cover mix-blend-multiply opacity-95"
            />
          </div>
        </section>

        {/* Slide 4: Mảng xanh tĩnh lặng */}
        <section className="px-6 py-16 bg-[#1C1A18] text-[#FCFAF2] space-y-6 border-y border-[#E1DDD5]/10">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
            MẢNG XANH TĨNH LẶNG
          </span>
          <h2 className="text-3xl font-bold font-serif text-white leading-tight">
            Khi sự sống ẩn mình trong những đường nét tối giản
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Một góc xanh nhỏ là bộ lọc tự nhiên cho những áp lực thường nhật.
            Dòng chậu cây sen đá sở hữu thiết kế nguyên khối gọn gàng cùng hệ
            thống rãnh thoát nước ẩn thông minh, giữ cho mặt bàn làm việc của
            bạn luôn khô ráo, ngăn nắp và thanh lịch.
          </p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900">
            <Image
              src={config.tech_image}
              alt="Mảng xanh tĩnh lặng"
              fill
              sizes="100vw"
              className="object-cover opacity-90"
            />
          </div>
        </section>

        {/* Slide 5: Vân nhám tương lai */}
        <section className="px-6 py-16 space-y-6">
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
            VÂN NHÁM TƯƠNG LAI
          </span>
          <h2 className="text-3xl font-bold font-serif text-black leading-tight">
            Tác phẩm nghệ thuật từ chất liệu sinh học lành tính
          </h2>
          <p className="text-sm text-[#5C564E] leading-relaxed">
            Mỗi sản phẩm được &quot;vẽ&quot; bằng nhựa PLA (chiết xuất từ tinh
            bột ngô/mía) thân thiện tuyệt đối với sức khỏe. Chúng tôi tinh chỉnh
            máy in để giữ lại cấu trúc vân nhám mịn tự nhiên — mộc mạc như gốm
            đất nung, bền bỉ với thời gian nhưng mang tinh thần của công nghệ
            tương lai.
          </p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white">
            <Image
              src={config.hero_image}
              alt="Vân nhám tương lai"
              fill
              sizes="100vw"
              className="object-cover mix-blend-multiply opacity-95"
            />
          </div>
        </section>

        {/* SLIDE 6: QUY TRÌNH CHẾ TÁC HOW IT WORKS CHO MOBILE */}
        <section className="px-6 py-16 border-y border-[#E1DDD5] bg-[#F7F4EB]">
          <HowItWorks />
        </section>

        {/* Slide 7.1: Featured Products */}
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

        {/* SLIDE 7.2 (MỚI): CHỈ HIỂN THỊ SẢN PHẨM GIẢM GIÁ TRÊN MOBILE NẾU CÓ DỮ LIỆU THỰC TẾ */}
        {hasSaleProducts && (
          <section className="px-6 py-16 bg-[#FBF9F4] border-y border-[#E1DDD5] relative overflow-hidden">
            <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
              <h2 className="text-3xl font-normal text-black font-serif">
                Sản phẩm đang ưu đãi
              </h2>
              <Link
                href="/shop?sale=true"
                className="text-xs font-mono uppercase tracking-widest text-red-600 hover:text-[#FF9D00]"
              >
                Nhận ưu đãi →
              </Link>
            </div>
            <ProductGrid products={saleProducts} />
          </section>
        )}

        {/* Slide 8: Collections */}
        <section className="px-6 py-16">
          <h2 className="text-3xl font-normal text-black font-serif border-b pb-4 border-[#E1DDD5] mb-8">
            Bộ sưu tập không gian
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
                    {idx === 0
                      ? "The Glow Space"
                      : idx === 1
                        ? "The Botanical Desk"
                        : "Minimal Living"}
                  </span>
                  <h3 className="text-xl font-bold font-serif">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Slide 9: The Journal */}
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

        {/* Slide 10: Bento Grid */}
        <section className="px-6 py-16">
          <div className="border-b pb-4 border-[#E1DDD5] mb-8">
            <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
              CỔNG TƯƠNG TÁC
            </span>
            <h2 className="text-3xl font-normal text-black font-serif mt-2">
              Cổng tương tác
            </h2>
          </div>
          <BentoPortalGrid />
        </section>

        {/* Slide 11: Sunset Pre-footer */}
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
              &quot;Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay hôm
              nay.&quot;
            </h3>
            <Button
              asChild
              size="lg"
              className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black rounded-xl py-4 font-mono font-bold tracking-wider"
            >
              <Link href="/contact">LIÊN HỆ ĐẶT IN NGAY</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* ============================================================================
         2. GIAO DIỆN DESKTOP (STICKY HORIZONTAL SCROLL): ĐỒNG BỘ NỀN KHUNG ĐỘNG 11 hoặc 12 SLIDES [21]
         ============================================================================ */}
      <motion.div
        ref={containerRef}
        className={`hidden md:block relative w-full ${containerHeightClass}`} // Động bộ 1100vh hoặc 1200vh
      >
        {/* THANH TIẾN TRÌNH CUỘN NGANG */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-[#FF9D00] origin-left z-50"
          style={{ scaleX }}
        />

        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E1DDD5_1px,transparent_1px),linear-gradient(to_bottom,#E1DDD5_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Dải trượt rộng w-[1100vw] hoặc w-[1200vw] tùy thuộc vào việc có sản phẩm giảm giá hay không */}
          <motion.div
            style={{ x }}
            className={`flex h-full items-center ${containerWidthClass}`}
          >
            {/* SLIDE 1: HERO SECTION */}
            <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <HeroVideoSection
                heroImage={config.hero_image}
                heroVideo={config.hero_video}
                heroSubtitle="Định nghĩa lại góc sống bằng những chiếc đèn nghệ thuật và vật dụng in 3D mang ngôn ngữ tối giản. Chất liệu sinh học lành tính giúp dọn dẹp mọi xao nhãng số, trả lại sự ấm áp thuần khiết cho tâm trí."
                onExploreClick={() => {
                  router.push("/shop");
                }}
              />
            </div>

            {/* SLIDE 2: TUYÊN NGÔN BOOSPACE */}
            <div className="w-[100vw] h-full shrink-0 relative flex flex-col items-center justify-center px-12 border-r border-[#E1DDD5]/50 bg-[#F7F4EB] overflow-hidden">
              <div className="dappled-shadow-overlay opacity-30" />
              <motion.div
                variants={textFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-5xl w-full text-center space-y-10 relative z-10"
              >
                <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                  TUYÊN NGÔN BOOSPACE
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light font-serif tracking-tight text-[#1E1C1A] leading-[1.25] max-w-4xl mx-auto">
                  Chúng tôi từ chối chấp nhận một tương lai nơi các thiết bị làm
                  ta{" "}
                  <span className="text-[#E26E67] font-semibold italic">
                    kiệt sức
                  </span>
                  ,{" "}
                  <span className="text-[#E26E67] font-semibold italic">
                    gây nghiện
                  </span>{" "}
                  và bủa vây bởi sự{" "}
                  <span className="text-[#E26E67] font-semibold italic relative">
                    xao nhãng
                    <sup className="text-xs text-[#FF9D00] ml-0.5 not-italic">
                      1
                    </sup>
                  </span>
                </h2>
                <p className="font-serif text-base sm:text-lg text-[#5C564E] leading-relaxed max-w-2xl mx-auto italic font-light pt-6 border-t border-[#E1DDD5]/60">
                  Boo Space tin rằng, một chiếc đèn tỏa ánh sáng dịu hay một
                  mảng xanh nhỏ gọn gàng có thể là điểm tựa kéo tâm trí bạn về
                  với sự bình yên hằng ngày.
                </p>
                <div className="pt-4 text-[9px] font-mono text-[#786F66]/60 uppercase tracking-widest max-w-md mx-auto font-semibold">
                  ¹ XAO NHÃNG: SỰ BỦA VÂY CỦA DÂY CÁP LỘN XỘN VÀ NHỮNG THÔNG BÁO
                  ĐẨY LIÊN TỤC.
                </div>
              </motion.div>
            </div>

            {/* SLIDE 3: KHÚC XẠ ẤM ÁP */}
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
                    KHÚC XẠ ẤM ÁP
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    Vũ điệu dịu dàng của hình khối và ánh sáng
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    Không còn những dải LED chói mắt gây mệt mỏi thị giác. Các
                    thiết kế đèn in 3D của Boo Space ứng dụng cấu trúc hình học
                    đặc biệt để khúc xạ ánh sáng thô thành những vầng sáng
                    ambient dịu mát, ôm ấp không gian sống của bạn khi đêm về.
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
                    alt="Vũ điệu ánh sáng"
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 4: MẢNG XANH TĨNH LẶNG */}
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
                    MẢNG XANH TĨNH LẶNG
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    Khi sự sống ẩn mình trong những đường nét tối giản
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    Một góc xanh nhỏ là bộ lọc tự nhiên cho những áp lực thường
                    nhật. Dòng chậu cây sen đá sở hữu thiết kế nguyên khối gọn
                    gàng cùng hệ thống rãnh thoát nước ẩn thông minh, giữ cho
                    mặt bàn làm việc của bạn luôn khô ráo, ngăn nắp và thanh
                    lịch.
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
                    alt="Mảng xanh tĩnh lặng"
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 5: VÂN NHÁM TƯƠNG LAI */}
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
                    VÂN NHÁM TƯƠNG LAI
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    Tác phẩm nghệ thuật từ chất liệu sinh học lành tính
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    Mỗi sản phẩm được &quot;vẽ&quot; bằng nhựa PLA (chiết xuất
                    từ tinh bột ngô/mía) thân thiện tuyệt đối với sức khỏe.
                    Chúng tôi tinh chỉnh máy in để giữ lại cấu trúc vân nhám mịn
                    tự nhiên — mộc mạc như gốm đất nung, bền bỉ với thời gian
                    nhưng mang tinh thần của công nghệ tương lai.
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
                    alt="Vân nhám thạch cao"
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 6: COMPONENT QUY TRÌNH CHẾ TÁC HOW IT WORKS CHO DESKTOP */}
            <HowItWorks />

            {/* SLIDE 7.1: SẢN PHẨM NỔI BẬT (MÀU KEM SÁNG TRẦM #F5F1E6) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F5F1E6] relative overflow-hidden">
              {/* Vầng sáng hoàng hôn hổ phách mờ ảo tỏa rộng nâng tầm sản phẩm nổi bật */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-gradient-radial from-[#FF8A00]/8 to-transparent blur-3xl pointer-events-none" />

              <div className="w-full max-w-7xl relative z-10">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      THE CORE PORTFOLIO
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

            {/* ============================================================================
               SLIDE 7.2 (MỚI THÊM): KHU VỰC SẢN PHẨM GIẢM GIÁ ĐỘNG (DỌN SẠCH CHÌM MÀU) [21]
               ============================================================================ */}
            {hasSaleProducts && (
              <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FBF9F4] relative overflow-hidden">
                {/* Vầng sáng Hồng san hô dịu dàng rọi sau lưới sản phẩm giảm giá chuẩn hãng */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-gradient-radial from-[#E26E67]/6 to-transparent blur-3xl pointer-events-none" />

                <div className="w-full max-w-7xl relative z-10">
                  <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                    <div>
                      <span className="text-[10px] font-mono text-[#E26E67] uppercase tracking-widest font-bold">
                        EXCLUSIVE OFFERS
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-normal text-black font-serif mt-2">
                        Sản phẩm đang ưu đãi
                      </h2>
                    </div>
                    <Link
                      href="/shop?sale=true"
                      className="text-xs font-mono uppercase tracking-widest text-red-600 hover:text-[#FF9D00] flex items-center gap-1.5 transition-colors"
                    >
                      Nhận ưu đãi →
                    </Link>
                  </div>
                  <ProductGrid products={saleProducts} />
                </div>
              </div>
            )}

            {/* Slide 8: Collections */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    COLLECTION
                  </span>
                  <h2 className="text-4xl font-normal text-black font-serif mt-2">
                    Bộ sưu tập không gian
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
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                            {idx === 0
                              ? "The Glow Space"
                              : idx === 1
                                ? "The Botanical Desk"
                                : "Minimal Living"}
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

            {/* Slide 9: The Journal */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F9F6ED]">
              <div className="w-full max-w-7xl">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      BLOG
                    </span>
                    <h2 className="text-4xl font-normal text-black font-serif mt-2">
                      The Journal
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-[#FF9D00] flex items-center gap-1.5 transition-colors"
                  >
                    Đọc nhật ký →
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

            {/* Slide 10: Bento Grid */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-4 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    CỔNG TƯƠNG TÁC
                  </span>
                  <h2 className="text-4xl font-normal text-black font-serif mt-2">
                    Cổng tương tác
                  </h2>
                </div>
                <BentoPortalGrid />
              </div>
            </div>

            {/* Slide 11: PRE-FOOTER */}
            <div
              className="w-[100vw] h-full shrink-0 relative flex items-center justify-center overflow-hidden border-l border-white/5"
              style={{
                backgroundColor: "#151513", // Đen nhạt graphite đồng nhất
                backgroundImage:
                  "radial-gradient(circle, #2d2d2a 1.1px, transparent 1.2px)", // Lưới ma trận pixel tinh xảo
                backgroundSize: "4px 4px", // Mật độ chấm lưới 4px đều tăm tắp
              }}
            >
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
                    &quot;Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay
                    hôm nay.&quot;
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
                    <Link href="/contact">LIÊN HỆ ĐẶT NGAY</Link>
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
