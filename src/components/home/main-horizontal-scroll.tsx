"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { BentoPortalGrid } from "./bento-portal-grid";
import { HeroVideoSection } from "./hero-video-section";
import { HowItWorks } from "./how-it-works";

interface MainHorizontalScrollProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featuredProducts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saleProducts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blogs: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
}

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      return () => {
        window.history.scrollRestoration = originalScrollRestoration;
      };
    }
  }, []);

  // ĐỒNG BỘ ĐỘNG TOÀN BỘ CÂU CHỮ TỪ SUPABASE (BẢNG SETTINGS -> CONFIG)
  const manifestoHeading =
    config?.manifesto_heading ||
    "Chúng tôi từ chối một tương lai nơi con người bị bủa vây bởi sự xao nhãng thường trực của mớ dây cáp lộn xộn và thông báo đẩy liên tục.";
  const manifestoDesc =
    config?.manifesto_desc ||
    "Boo Space tin rằng, sức mạnh của tư duy bắt đầu từ sự ngăn nắp trực giác. Một vầng sáng ambient dịu mát hay một góc xanh gọn gàng trên bàn làm việc không đơn thuần là món đồ trang trí, đó là điểm tựa xúc giác neo giữ sự tĩnh lặng của bạn giữa kỷ nguyên số.";

  const slide1Tag = config?.slide1_tag || "ÁNH SÁNG KHÚC XẠ";
  const slide1Title =
    config?.slide1_title || "Liệu pháp thị giác cho những đêm tư duy sâu";
  const slide1Desc =
    config?.slide1_desc ||
    "Loại bỏ hoàn toàn những nguồn sáng LED trực diện gây căng thẳng thị giác. Chúng tôi ứng dụng cấu trúc hình học nguyên khối để khúc xạ nguồn sáng thô thành vệt sáng ambient êm dịu. Đây là thánh đường ánh sáng bảo vệ đôi mắt và đánh thức khả năng tập trung tối đa của bạn lúc nửa đêm.";

  const slide2Tag = config?.slide2_tag || "MẢNG XANH THÔNG MINH";
  const slide2Title =
    config?.slide2_title || "Khi thiên nhiên đồng hành cùng sự ngăn nắp";
  const slide2Desc =
    config?.slide2_desc ||
    "Một mầm sống nhỏ trên bàn làm việc là bộ lọc tự nhiên giải tỏa áp lực tinh thần. Dòng chậu cây tối giản tích hợp hệ thống tự tưới và rãnh thoát nước ẩn thông minh, giữ cho mặt bàn của bạn luôn khô ráo tuyệt đối, ngăn nắp và thanh lịch mà không tốn công chăm sóc.";

  const slide3Tag = config?.slide3_tag || "VÂN NHÁM KỸ THUẬT";
  const slide3Title =
    config?.slide3_title || "Mộc mạc như gốm nung, bền bỉ cùng thời gian";
  const slide3Desc =
    config?.slide3_desc ||
    "Chúng tôi từ bỏ các loại nhựa giòn thông thường để chế tác bằng nhựa CR-PETG cao cấp — sở hữu khả năng chịu nhiệt cao (∼70–80°C) và chống ẩm mốc tuyệt đối. Từng đường in được tinh chỉnh tỉ mỉ để giữ lại vân nhám mịn nguyên bản, mang đến cảm giác chạm mộc mạc nhưng bền bỉ vô hạn.";

  const prefooterTitle =
    config?.prefooter_title ||
    '"Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay hôm nay."';
  const prefooterNote =
    config?.prefooter_note ||
    "Do được chế tác từ nhựa kỹ thuật CR-PETG cao cấp, sản phẩm của BooSpace chịu nhiệt vượt trội (∼70–80°C) và chống ẩm mốc tuyệt đối. Khuyến cáo tránh để sản phẩm trong ô tô đóng kín cửa dưới trời nắng gắt kéo dài.";

  const hasSaleProducts = saleProducts && saleProducts.length > 0;
  const containerHeightClass = hasSaleProducts ? "h-[1200vh]" : "h-[1100vh]";
  const containerWidthClass = hasSaleProducts ? "w-[1200vw]" : "w-[1100vw]";
  const maxTranslateX = hasSaleProducts ? "-91.66%" : "-90.9%";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
  });

  const x = useTransform(smoothScrollProgress, [0, 1], ["0%", maxTranslateX]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* MOBILE LAYOUT */}
      <div className="block md:hidden space-y-16 bg-[#FCFAF2] text-[#1E1C1A]">
        <HeroVideoSection
          heroImage={config.hero_image}
          heroVideo={config.hero_video}
          heroSubtitle={
            config?.hero_subtitle ||
            "Định nghĩa lại góc sống bằng những chiếc đèn nghệ thuật và vật dụng in 3D mang ngôn ngữ tối giản. Chất liệu CR-PETG kỹ thuật cao cấp giúp dọn dẹp mọi xao nhãng số, trả lại sự ấm áp thuần khiết cho tâm trí."
          }
          onExploreClick={() => {
            router.push("/shop");
          }}
        />

        {/* Slide 2: Tuyên ngôn */}
        <section className="bg-[#F7F4EB] py-20 px-6 text-center border-y border-[#E1DDD5] relative overflow-hidden">
          <div className="dappled-shadow-overlay opacity-20" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-relaxed tracking-tight text-[#1E1C1A] max-w-4xl mx-auto">
              {manifestoHeading}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5C564E] leading-relaxed max-w-2xl mx-auto font-normal pt-2">
              {manifestoDesc}
            </p>
            <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest mt-8 font-bold">
              BRAND MANIFESTO • BOOSPACE
            </p>
          </div>
        </section>

        {/* Slide 3: Ánh sáng khúc xạ */}
        <section className="px-6 py-16 space-y-6">
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
            {slide1Tag}
          </span>
          <h2 className="text-3xl font-bold font-serif text-black leading-tight">
            {slide1Title}
          </h2>
          <p className="text-sm text-[#5C564E] leading-relaxed">{slide1Desc}</p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white">
            <Image
              src={config.diy_image}
              alt={slide1Title}
              fill
              sizes="100vw"
              className="object-cover mix-blend-multiply opacity-95"
            />
          </div>
        </section>

        {/* Slide 4: Mảng xanh thông minh */}
        <section className="px-6 py-16 bg-[#1C1A18] text-[#FCFAF2] space-y-6 border-y border-[#E1DDD5]/10">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
            {slide2Tag}
          </span>
          <h2 className="text-3xl font-bold font-serif text-white leading-tight">
            {slide2Title}
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {slide2Desc}
          </p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900">
            <Image
              src={config.tech_image}
              alt={slide2Title}
              fill
              sizes="100vw"
              className="object-cover opacity-90"
            />
          </div>
        </section>

        {/* Slide 5: Vân nhám kỹ thuật */}
        <section className="px-6 py-16 space-y-6">
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
            {slide3Tag}
          </span>
          <h2 className="text-3xl font-bold font-serif text-black leading-tight">
            {slide3Title}
          </h2>
          <p className="text-sm text-[#5C564E] leading-relaxed">{slide3Desc}</p>
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white">
            <Image
              src={config.hero_image}
              alt={slide3Title}
              fill
              sizes="100vw"
              className="object-cover mix-blend-multiply opacity-95"
            />
          </div>
        </section>

        {/* Slide 6: How It Works */}
        <section className="px-6 py-16 border-y border-[#E1DDD5] bg-[#F7F4EB]">
          <HowItWorks
            steps={config?.how_it_works_steps}
            title={config?.how_it_works_title}
            tagline={config?.how_it_works_tagline}
          />
        </section>

        {/* Slide 7.1: Featured Products */}
        <section className="px-6 py-16 bg-[#F5F1E6] border-y border-[#E1DDD5]">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
            <h2 className="text-3xl font-bold text-black font-serif">
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

        {/* Slide 7.2: Sale Products */}
        {hasSaleProducts && (
          <section className="px-6 py-16 bg-[#FBF9F4] border-y border-[#E1DDD5] relative overflow-hidden">
            <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
              <h2 className="text-3xl font-bold text-black font-serif">
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

        {/* Slide 8: Collections (Đã nối Supabase DB cho Description) */}
        <section className="px-6 py-16">
          <h2 className="text-3xl font-bold text-black font-serif border-b pb-4 border-[#E1DDD5] mb-8">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    {cat.name}
                  </span>
                  <h3 className="text-xl font-bold font-serif mt-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {cat.description ||
                      (idx === 0
                        ? "Thánh đường của sự tập trung sáng tạo khi đêm về."
                        : "Mảng xanh sinh thái tự vận hành cho góc làm việc.")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Slide 9: Journal */}
        <section className="px-6 py-16 bg-[#F9F6ED] border-y border-[#E1DDD5]">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
            <h2 className="text-3xl font-bold text-black font-serif">
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

        {/* Slide 10: Bento */}
        <section className="px-6 py-16">
          <div className="border-b pb-4 border-[#E1DDD5] mb-8">
            <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
              CỔNG TƯƠNG TÁC
            </span>
            <h2 className="text-3xl font-bold text-black font-serif mt-2">
              Cổng tương tác
            </h2>
          </div>
          <BentoPortalGrid />
        </section>

        {/* Slide 11: Pre-footer */}
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
              {prefooterTitle}
            </h3>
            <p className="text-[11px] font-sans text-neutral-400 max-w-xl mx-auto leading-relaxed border-t border-white/10 pt-4">
              <strong>Lưu ý bảo quản sản phẩm:</strong> {prefooterNote}
            </p>
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

      {/* DESKTOP HORIZONTAL SCROLL */}
      <motion.div
        ref={containerRef}
        className={`hidden md:block relative w-full ${containerHeightClass}`}
      >
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-[#FF9D00] origin-left z-50"
          style={{ scaleX }}
        />

        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E1DDD5_1px,transparent_1px),linear-gradient(to_bottom,#E1DDD5_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          <motion.div
            style={{ x }}
            className={`flex h-full items-center ${containerWidthClass}`}
          >
            {/* SLIDE 1 */}
            <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <HeroVideoSection
                heroImage={config.hero_image}
                heroVideo={config.hero_video}
                heroSubtitle={
                  config?.hero_subtitle ||
                  "Định nghĩa lại góc sống bằng những chiếc đèn nghệ thuật và vật dụng in 3D mang ngôn ngữ tối giản. Chất liệu CR-PETG kỹ thuật cao cấp giúp dọn dẹp mọi xao nhãng số, trả lại sự ấm áp thuần khiết cho tâm trí."
                }
                onExploreClick={() => {
                  router.push("/shop");
                }}
              />
            </div>

            {/* SLIDE 2: TUYÊN NGÔN */}
            <div className="w-[100vw] h-full shrink-0 relative flex flex-col items-center justify-center px-12 border-r border-[#E1DDD5]/50 bg-[#F7F4EB] overflow-hidden">
              <div className="dappled-shadow-overlay opacity-30" />
              <motion.div
                variants={textFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-5xl w-full text-center space-y-8 relative z-10"
              >
                <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                  BRAND MANIFESTO • BOOSPACE
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#1E1C1A] leading-[1.3] max-w-4xl mx-auto">
                  {manifestoHeading}
                </h2>
                <p className="font-sans text-base sm:text-lg text-[#5C564E] leading-relaxed max-w-2xl mx-auto font-normal pt-6 border-t border-[#E1DDD5]/60">
                  {manifestoDesc}
                </p>
              </motion.div>
            </div>

            {/* SLIDE 3 */}
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
                    {slide1Tag}
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    {slide1Title}
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    {slide1Desc}
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
                    alt={slide1Title}
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 4 */}
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
                    {slide2Tag}
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    {slide2Title}
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    {slide2Desc}
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
                    alt={slide2Title}
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            {/* SLIDE 5 */}
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
                    {slide3Tag}
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    {slide3Title}
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    {slide3Desc}
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
                    alt={slide3Title}
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </motion.div>
              </div>
            </div>

            <HowItWorks
              steps={config?.how_it_works_steps}
              title={config?.how_it_works_title}
              tagline={config?.how_it_works_tagline}
            />

            {/* SLIDE 7.1 */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F5F1E6] relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-gradient-radial from-[#FF8A00]/8 to-transparent blur-3xl pointer-events-none" />

              <div className="w-full max-w-7xl relative z-10">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      THE CORE PORTFOLIO
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-black font-serif mt-2">
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

            {/* SLIDE 7.2 */}
            {hasSaleProducts && (
              <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FBF9F4] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-gradient-radial from-[#E26E67]/6 to-transparent blur-3xl pointer-events-none" />

                <div className="w-full max-w-7xl relative z-10">
                  <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                    <div>
                      <span className="text-[10px] font-mono text-[#E26E67] uppercase tracking-widest font-bold">
                        EXCLUSIVE OFFERS
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-bold text-black font-serif mt-2">
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

            {/* SLIDE 8 */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    COLLECTION
                  </span>
                  <h2 className="text-4xl font-bold text-black font-serif mt-2">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white text-left">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                            {cat.name}
                          </span>
                          <h3 className="text-2xl font-bold font-serif mt-1">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-neutral-300 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                            {cat.description ||
                              (idx === 0
                                ? "Thánh đường của sự tập trung sáng tạo khi đêm về. Khám phá các thiết kế khúc xạ ánh sáng tối giản được thiết kế riêng cho những góc tối muộn."
                                : idx === 1
                                  ? "Mảng xanh sinh thái tự vận hành cho góc làm việc luôn khô ráo và thanh lịch."
                                  : "Giải pháp lưu trữ ngăn nắp cho không gian sống hiện đại.")}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* SLIDE 9 */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F9F6ED]">
              <div className="w-full max-w-7xl">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      BLOG
                    </span>
                    <h2 className="text-4xl font-bold text-black font-serif mt-2">
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
                        <p className="text-xs text-[#5C564E] line-clamp-2 leading-relaxed font-sans">
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

            {/* SLIDE 10 */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-4 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    CỔNG TƯƠNG TÁC
                  </span>
                  <h2 className="text-4xl font-bold text-black font-serif mt-2">
                    Cổng tương tác
                  </h2>
                </div>
                <BentoPortalGrid />
              </div>
            </div>

            {/* SLIDE 11: PRE-FOOTER */}
            <div
              className="w-[100vw] h-full shrink-0 relative flex items-center justify-center overflow-hidden border-l border-white/5"
              style={{
                backgroundColor: "#151513",
                backgroundImage:
                  "radial-gradient(circle, #2d2d2a 1.1px, transparent 1.2px)",
                backgroundSize: "4px 4px",
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
                  <h3 className="text-2xl sm:text-3xl font-serif leading-relaxed italic text-white/95">
                    {prefooterTitle}
                  </h3>
                  <p className="text-[11px] font-sans text-neutral-400 leading-relaxed border-t border-white/10 pt-3">
                    <strong>Lưu ý bảo quản sản phẩm:</strong> {prefooterNote}
                  </p>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-2">
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
