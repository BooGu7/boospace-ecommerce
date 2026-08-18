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
import { BentoPortalGrid } from "./bento-portal-grid";
import { HeroVideoSection } from "./hero-video-section";
import { HowItWorks } from "./how-it-works";
import { Button } from "@/components/ui/button";

interface MainHorizontalScrollProps {
  categories: any[];
  featuredProducts: any[];
  saleProducts: any[];
  blogs: any[];
  config: any;
}

const formatVNDateString = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

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
  categories = [],
  featuredProducts = [],
  saleProducts = [],
  blogs = [],
  config = {},
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

  const manifestoHeading = config.manifesto_heading;
  const manifestoDesc = config.manifesto_desc;

  // Slide 1 (Ánh sáng khúc xạ)
  const slide1Tag = config.slide1_tag || "ÁNH SÁNG KHÚC XẠ";
  const slide1Title = config.slide1_title || "";
  const slide1Desc = config.slide1_desc || "";
  const slide1Image = config.slide1_image || config.diy_image || "";

  // Slide 2 (Mảng xanh thông minh)
  const slide2Tag = config.slide2_tag || "MẢNG XANH THÔNG MINH";
  const slide2Title = config.slide2_title || "";
  const slide2Desc = config.slide2_desc || "";
  const slide2Image = config.slide2_image || config.tech_image || "";

  // Slide 3 (Vân nhám CR-PETG) - ĐỌC RIÊNG BIỆT KHÓA SLIDE3_IMAGE
  const slide3Tag = config.slide3_tag || "VÂN NHÁM KỸ THUẬT";
  const slide3Title = config.slide3_title || "";
  const slide3Desc = config.slide3_desc || "";
  const slide3Image = config.slide3_image || "";

  const prefooterTitle = config.prefooter_title;
  const prefooterNote = config.prefooter_note;

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
          heroSubtitle={config.hero_subtitle}
          featuredHeading={config.featured_heading}
          featuredDesc={config.featured_desc}
          onExploreClick={() => router.push("/shop")}
        />

        {manifestoHeading && (
          <section className="bg-[#F7F4EB] py-20 px-6 text-center border-y border-[#E1DDD5] relative overflow-hidden">
            <div className="dappled-shadow-overlay opacity-20" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-relaxed tracking-tight text-[#1E1C1A] max-w-4xl mx-auto">
                {manifestoHeading}
              </h2>
              {manifestoDesc && (
                <p className="font-sans text-xs sm:text-sm text-[#5C564E] leading-relaxed max-w-2xl mx-auto font-normal pt-2">
                  {manifestoDesc}
                </p>
              )}
              <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest mt-8 font-bold">
                BRAND MANIFESTO • BOO SPACE
              </p>
            </div>
          </section>
        )}

        <section className="px-6 space-y-12">
          {slide1Title && (
            <div className="space-y-4 text-left">
              <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
                {slide1Tag}
              </span>
              <h3 className="text-2xl font-bold font-serif text-black">
                {slide1Title}
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                {slide1Desc}
              </p>
              {slide1Image && (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E1DDD5]">
                  <Image
                    src={slide1Image}
                    alt={slide1Title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {slide2Title && (
            <div className="space-y-4 text-left">
              <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
                {slide2Tag}
              </span>
              <h3 className="text-2xl font-bold font-serif text-black">
                {slide2Title}
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                {slide2Desc}
              </p>
              {slide2Image && (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E1DDD5]">
                  <Image
                    src={slide2Image}
                    alt={slide2Title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {slide3Title && (
            <div className="space-y-4 text-left">
              <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
                {slide3Tag}
              </span>
              <h3 className="text-2xl font-bold font-serif text-black">
                {slide3Title}
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                {slide3Desc}
              </p>
              {slide3Image && (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E1DDD5]">
                  <Image
                    src={slide3Image}
                    alt={slide3Title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </section>

        <section className="px-6 py-16">
          <h2 className="text-3xl font-bold text-black font-serif border-b pb-4 border-[#E1DDD5] mb-8">
            Bộ sưu tập không gian
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {categories
              ?.filter((c) => c.active !== false)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative aspect-square rounded-3xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/40 shadow-sm"
                >
                  <Image
                    src={cat.image_url || cat.imageUrl || slide1Image}
                    alt={cat.name}
                    fill
                    sizes="100vw"
                    className="object-cover mix-blend-multiply opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white text-left">
                    <h3 className="text-xl font-bold font-serif mt-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-neutral-200 font-sans mt-1 line-clamp-2 leading-relaxed font-medium">
                      {cat.description ||
                        cat.desc ||
                        `Khám phá các thiết kế không gian độc bản thuộc bộ sưu tập ${cat.name}.`}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        <section className="px-6 py-16 bg-[#F9F6ED] border-y border-[#E1DDD5]">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
            <h2 className="text-3xl font-bold text-black font-serif">
              Nhật ký hành trình
            </h2>
            <Link
              href="/blog"
              className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-amber-600"
            >
              Đọc nhật ký →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {blogs?.slice(0, 3).map((post, idx) => (
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
                <div className="text-[10px] font-mono text-[#786F66]">
                  0{idx + 1} / {formatVNDateString(post.publishedAt)}
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

        <section className="px-6 py-16">
          <BentoPortalGrid />
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
            {/* SLIDE 1: HERO BANNER & VIDEO (ĐỌC RIÊNG BIỆT CONFIG.HERO_IMAGE) */}
            <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <HeroVideoSection
                heroImage={config.hero_image}
                heroVideo={config.hero_video}
                heroSubtitle={config.hero_subtitle}
                featuredHeading={config.featured_heading}
                featuredDesc={config.featured_desc}
                onExploreClick={() => router.push("/shop")}
              />
            </div>

            {/* SLIDE 2: TUYÊN NGÔN THƯƠNG HIỆU */}
            {manifestoHeading && (
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
                    BRAND MANIFESTO • BOO SPACE
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#1E1C1A] leading-[1.3] max-w-4xl mx-auto">
                    {manifestoHeading}
                  </h2>
                  {manifestoDesc && (
                    <p className="font-sans text-base sm:text-lg text-[#5C564E] leading-relaxed max-w-2xl mx-auto font-normal pt-6 border-t border-[#E1DDD5]/60">
                      {manifestoDesc}
                    </p>
                  )}
                </motion.div>
              </div>
            )}

            {/* SLIDE 3: ÁNH SÁNG KHÚC XẠ */}
            {slide1Title && (
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
                    {slide1Desc && (
                      <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                        {slide1Desc}
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    variants={imageParallax}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
                  >
                    {slide1Image && (
                      <Image
                        src={slide1Image}
                        alt={slide1Title}
                        fill
                        sizes="50vw"
                        className="object-cover mix-blend-multiply opacity-95"
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            )}

            {/* SLIDE 4: MẢNG XANH THÔNG MINH */}
            {slide2Title && (
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
                    {slide2Desc && (
                      <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                        {slide2Desc}
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    variants={imageParallax}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
                  >
                    {slide2Image && (
                      <Image
                        src={slide2Image}
                        alt={slide2Title}
                        fill
                        sizes="50vw"
                        className="object-cover mix-blend-multiply opacity-95"
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            )}

            {/* SLIDE 5: VÂN NHÁM CR-PETG (ĐỌC RIÊNG BIỆT CONFIG.SLIDE3_IMAGE) */}
            {slide3Title && (
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
                    {slide3Desc && (
                      <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                        {slide3Desc}
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    variants={imageParallax}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
                  >
                    {slide3Image && (
                      <Image
                        src={slide3Image}
                        alt={slide3Title}
                        fill
                        sizes="50vw"
                        className="object-cover mix-blend-multiply opacity-95"
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            )}

            <HowItWorks
              steps={config?.how_it_works_steps}
              title={config?.how_it_works_title}
              tagline={config?.how_it_works_tagline}
            />

            {/* SLIDE 7.1 FEATURED PRODUCTS */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F5F1E6] relative overflow-hidden">
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

            {/* SLIDE 7.2 SALE PRODUCTS */}
            {hasSaleProducts && (
              <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FBF9F4] relative overflow-hidden">
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

            {/* SLIDE 8 COLLECTIONS */}
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
                  {categories
                    ?.filter((c) => c.active !== false)
                    .map((cat) => (
                      <motion.div key={cat.id} whileHover={{ y: -8 }}>
                        <Link
                          href={`/shop?category=${cat.slug}`}
                          className="group relative aspect-square rounded-3xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/40 shadow-sm transition-all hover:border-[#1E1C1A] block"
                        >
                          <Image
                            src={cat.image_url || cat.imageUrl || slide1Image}
                            alt={cat.name}
                            fill
                            sizes="33vw"
                            className="object-cover mix-blend-multiply opacity-80 group-hover:opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white text-left">
                            <h3 className="text-2xl text-amber-400 font-bold font-serif mt-1">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-neutral-200 font-sans mt-1.5 line-clamp-2 leading-relaxed font-medium">
                              {cat.description ||
                                cat.desc ||
                                `Khám phá các thiết kế không gian độc bản thuộc bộ sưu tập ${cat.name}.`}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>

            {/* SLIDE 9 THE JOURNAL */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#F9F6ED]">
              <div className="w-full max-w-7xl">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      JOURNAL
                    </span>
                    <h2 className="text-4xl font-bold text-black font-serif mt-2">
                      Nhật ký hành trình
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
                  {blogs?.slice(0, 3).map((post, idx) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group p-8 space-y-6 flex flex-col justify-between hover:bg-[#FAF5F2]/40 transition-colors"
                    >
                      <div className="space-y-4 text-left">
                        <div className="text-[10px] font-mono text-[#786F66]">
                          0{idx + 1} / {formatVNDateString(post.publishedAt)}
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
                          sizes="33vw"
                          className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <BentoPortalGrid />
              </div>
            </div>

            {/* PRE-FOOTER */}
            {prefooterTitle && (
              <div
                className="w-[100vw] h-full shrink-0 relative flex items-center justify-center overflow-hidden border-l border-white/5"
                style={{
                  backgroundColor: "#151513",
                  backgroundImage:
                    "radial-gradient(circle, #2d2d2a 1.1px, transparent 1.2px)",
                  backgroundSize: "4px 4px",
                }}
              >
                <div className="max-w-7xl px-24 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="space-y-4 text-left flex-1 max-w-3xl">
                    <h3 className="text-2xl sm:text-3xl font-serif leading-relaxed italic text-white/95">
                      {prefooterTitle}
                    </h3>
                    {prefooterNote && (
                      <p className="text-[11px] font-sans text-neutral-400 leading-relaxed border-t border-white/10 pt-3">
                        <strong>Lưu ý bảo quản sản phẩm:</strong>{" "}
                        {prefooterNote}
                      </p>
                    )}
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
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
