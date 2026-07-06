"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Heart,
  Cpu,
  Layers,
  Settings,
  Monitor,
  Award,
  Globe,
  CheckCircle2,
  HelpCircle,
  Play,
} from "lucide-react";
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

export function MainHorizontalScroll({
  categories,
  featuredProducts,
  blogs,
  config,
}: MainHorizontalScrollProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Theo dõi tiến trình cuộn dọc trong tầm h-scroll 1000vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Ánh xạ biến đổi màu nền tổng thể mượt mà
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#FCFAF2", "#FCFAF2", "#1C1A18", "#111111", "#000000"],
  );

  // Tịnh tiến 11 slide rộng 100vw xếp cạnh nhau (1100vw)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-90.9%"]);

  return (
    <>
      {/* THIẾT BỊ DI ĐỘNG (MOBILE): Dàn dọc tự nhiên không giật lag */}
      <div className="block md:hidden space-y-16 bg-[#FCFAF2] text-[#1E1C1A]">
        {/* Slide 1: Hero Section */}
        <HeroVideoSection
          heroImage={config.hero_image}
          heroVideo={config.hero_video}
          heroSubtitle={config.hero_subtitle}
        />

        {/* Slide 2: Tuyên ngôn */}
        <section className="bg-white py-16 px-4 text-center border-b border-[#E1DDD5]">
          <h2 className="text-3xl font-normal font-serif leading-tight tracking-tight text-black max-w-4xl mx-auto">
            {config.statement_title}
          </h2>
          <p className="text-xs font-mono text-[#786F66] uppercase tracking-widest mt-6">
            {config.statement_subtitle}
          </p>
        </section>

        {/* Slide 3: Specs Line Art */}
        <section
          className="relative min-h-[50vh] flex items-center border-b border-[#E1DDD5] py-16 bg-cover bg-center"
          style={{ backgroundImage: `url(${config.diy_image})` }}
        >
          <div className="absolute inset-0 bg-black/45 z-0" />
          <div className="relative z-10 p-6 text-white space-y-6 w-full">
            <span className="text-xs font-mono text-[#3ECF8E] uppercase tracking-widest font-bold">
              {config.display_tag}
            </span>
            <h2 className="text-3xl font-normal font-serif leading-tight">
              {config.display_title}
            </h2>
            <div className="space-y-4 pt-6 border-t border-white/20">
              <div className="flex gap-4">
                <Sparkles className="size-4 text-[#3ECF8E] shrink-0" />
                <p className="text-xs text-white/70 leading-normal">
                  <strong>{config.display_spec_1_val}:</strong>{" "}
                  {config.display_spec_1_lbl}
                </p>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="size-4 text-[#3ECF8E] shrink-0" />
                <p className="text-xs text-white/70 leading-normal">
                  <strong>{config.display_spec_2_val}:</strong>{" "}
                  {config.display_spec_2_lbl}
                </p>
              </div>
              <div className="flex gap-4">
                <Heart className="size-4 text-[#3ECF8E] shrink-0" />
                <p className="text-xs text-white/70 leading-normal">
                  <strong>{config.display_spec_3_val}:</strong>{" "}
                  {config.display_spec_3_lbl}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4: Bento Grid Góp ý & AI Search */}
        <section className="px-4 py-16 border-b border-[#E1DDD5]">
          <div className="border-b pb-4 border-[#E1DDD5] mb-8">
            <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest">
              03 / STRUCTURAL ANATOMY
            </span>
            <h2 className="text-3xl font-normal text-black font-serif mt-2">
              Workspace Bento Grid
            </h2>
          </div>
          <BentoPortalGrid />
        </section>

        {/* Slide 5: Featured Products (Sản phẩm nổi bật) */}
        <section className="px-4 py-16 border-b border-[#E1DDD5]">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
            <h2 className="text-3xl font-normal text-black font-serif">
              Sản phẩm nổi bật
            </h2>
            <Link
              href="/shop"
              className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A]"
            >
              Xem tất cả →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        {/* Slide 6: Collections (Bộ sưu tập không gian) */}
        <section className="px-4 py-16 border-b border-[#E1DDD5]">
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    0{idx + 1}
                  </span>
                  <h3 className="text-xl font-bold font-serif">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Slide 7: The Journal */}
        <section className="px-4 py-16 border-b border-[#E1DDD5]">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8">
            <h2 className="text-3xl font-normal text-black font-serif">
              The Journal
            </h2>
            <Link
              href="/blog"
              className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A]"
            >
              Đọc tất cả →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {blogs?.map((post, idx) => (
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
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg font-serif">{post.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Slide 8: Sunset Pre-footer */}
        <section className="relative text-white bg-black py-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-gradient-radial from-[#FF8A00]/15 to-transparent blur-3xl -translate-y-[80%]" />
          <div className="px-4 relative z-10 text-center space-y-6">
            <h3 className="text-2xl font-serif italic leading-relaxed px-4">
              &quot;{config.manifesto_quote}&quot;
            </h3>
            <Button
              asChild
              size="lg"
              className="w-full bg-[#FF9D00] text-black rounded-xl"
            >
              <Link href="/shop">ORDER NOW</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* GIAO DIỆN DESKTOP (STICKY SLIDING SCROLL): Sửa lỗi "Chìm màu" bằng việc bọc màu nền Kem vững chắc cho các panel hiển thị sản phẩm */}
      <motion.div
        ref={containerRef}
        style={{ backgroundColor }}
        className="hidden md:block relative h-[1000vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E1DDD5_1px,transparent_1px),linear-gradient(to_bottom,#E1DDD5_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Dải trượt ngang tịnh tiến liên tục */}
          <motion.div
            style={{ x }}
            className="flex w-[1100vw] h-full items-center"
          >
            {/* SLIDE 1: HERO SECTION */}
            <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <HeroVideoSection
                heroImage={config.hero_image}
                heroVideo={config.hero_video}
                heroSubtitle={config.hero_subtitle}
              />
            </div>

            {/* SLIDE 2: TUYÊN NGÔN BOOSPACE */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="max-w-4xl text-center space-y-8">
                <span className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">
                  02 / TUYÊN NGÔN BOOSPACE
                </span>
                <h2 className="text-5xl lg:text-6xl font-normal font-serif leading-tight tracking-tight text-black max-w-3xl mx-auto">
                  {config.statement_title}
                </h2>
              </div>
            </div>

            {/* SLIDE 3: ĐIỂM CHẠM XÚC GIÁC */}
            <div
              className="w-[100vw] h-full shrink-0 relative flex items-center justify-center border-r border-[#E1DDD5]/50 bg-cover bg-center"
              style={{ backgroundImage: `url(${config.diy_image})` }}
            >
              <div className="absolute inset-0 bg-black/25 z-0" />
              <div className="relative z-10 w-full px-24 flex flex-col justify-between h-[65%] text-white">
                <div className="space-y-4">
                  <span className="text-xs font-mono text-[#3ECF8E] uppercase tracking-widest font-bold">
                    {config.display_tag}
                  </span>
                  <h2 className="text-5xl font-normal font-serif leading-tight">
                    {config.display_title}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-12 pt-8 border-t border-white/20">
                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      <Sparkles className="size-4 text-[#3ECF8E]" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h4 className="font-bold text-sm">
                        {config.display_spec_1_val}
                      </h4>
                      <p className="text-xs text-white/70 leading-normal">
                        {config.display_spec_1_lbl}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      <ShieldCheck className="size-4 text-[#3ECF8E]" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h4 className="font-bold text-sm">
                        {config.display_spec_2_val}
                      </h4>
                      <p className="text-xs text-white/70 leading-normal">
                        {config.display_spec_2_lbl}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                      <Heart className="size-4 text-[#3ECF8E]" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h4 className="font-bold text-sm">
                        {config.display_spec_3_val}
                      </h4>
                      <p className="text-xs text-white/70 leading-normal">
                        {config.display_spec_3_lbl}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 4: CHẠM THÔ MỘC */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <div className="col-span-6 space-y-6 text-left">
                  <span className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">
                    01 / CHẠM THÔ MỘC
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    {config.scroll_slide_1_title}
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    {config.scroll_slide_1_desc}
                  </p>
                </div>
                <div className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl">
                  <Image
                    src={config.diy_image}
                    alt="Chạm thô mộc"
                    fill
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </div>
              </div>
            </div>

            {/* SLIDE 5: TRÁNH XAO NHÃNG */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <div className="col-span-6 space-y-6 text-left text-white">
                  <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                    02 / TRÁNH XAO NHÃNG
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-[#FCFAF2] leading-tight">
                    {config.scroll_slide_2_title}
                  </h2>
                  <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                    {config.scroll_slide_2_desc}
                  </p>
                </div>
                <div className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
                  <Image
                    src={config.tech_image}
                    alt="Tránh xao nhãng"
                    fill
                    className="object-cover opacity-90"
                  />
                </div>
              </div>
            </div>

            {/* SLIDE 6: CÔNG THÁI HỌC */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <div className="col-span-6 space-y-6 text-left text-white">
                  <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                    03 / CÔNG THÁI HỌC
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-white leading-tight">
                    {config.scroll_slide_3_title}
                  </h2>
                  <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                    {config.scroll_slide_3_desc}
                  </p>
                </div>
                <div className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-amber-500/10 bg-neutral-950 shadow-2xl">
                  <Image
                    src={config.hero_image}
                    alt="Góc nghiêng bảo vệ sức khỏe"
                    fill
                    className="object-cover opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* SLIDE 7: BENTO GRID (GÓP Ý & AI SEARCH) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-4 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest">
                    03 / STRUCTURAL ANATOMY
                  </span>
                  <h2 className="text-4xl font-normal text-black font-serif mt-2">
                    Workspace Bento Grid
                  </h2>
                </div>
                <BentoPortalGrid />
              </div>
            </div>

            {/* SLIDE 8: SẢN PHẨM NỔI BẬT (SECTION 1) - CỐ ĐỊNH MÀU KEM SÁNG TRÁNH CHÌM CHỮ */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest">
                      04 / THE CORE PORTFOLIO
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

            {/* SLIDE 9: BỘ SƯU TẬP KHÔNG GIAN (SECTION 2) - CỐ ĐỊNH MÀU KEM SÁNG TRÁNH CHÌM CHỮ */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest">
                    05 / SPACE &amp; MODULES
                  </span>
                  <h2 className="text-4xl font-normal text-black font-serif mt-2">
                    Bộ sưu tập không gian
                  </h2>
                </div>
                <div className="grid gap-6 grid-cols-3 bg-[#FCFAF2]">
                  {categories?.map((cat, idx) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className="group relative aspect-square rounded-3xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/40 shadow-sm transition-all hover:border-[#1E1C1A]"
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
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover mix-blend-multiply opacity-80 group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-8 text-white text-left">
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                          Collection 0{idx + 1}
                        </span>
                        <h3 className="text-2xl font-bold font-serif mt-1">
                          {cat.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* SLIDE 10: THE JOURNAL (BLOGS) - CỐ ĐỊNH MÀU KEM SÁNG TRÁNH CHÌM CHỮ */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FCFAF2]">
              <div className="w-full max-w-7xl">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] mb-8 text-left">
                  <div>
                    <span className="text-xs font-mono text-[#786F66] uppercase tracking-widest">
                      06 / CHRONICLES OF FLOW
                    </span>
                    <h2 className="text-4xl font-normal text-black font-serif mt-2">
                      The Journal
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-[#3ECF8E] flex items-center gap-1.5 transition-colors"
                  >
                    Đọc tất cả →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-0 border-x border-b border-[#E1DDD5] bg-white divide-x divide-[#E1DDD5]">
                  {blogs?.map((post, idx) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group p-8 space-y-6 flex flex-col justify-between hover:bg-[#FAF5F2]/30 transition-colors"
                    >
                      <div className="space-y-4 text-left">
                        <div className="text-xs font-mono text-[#786F66]">
                          0{idx + 1} / {formatDate(post.publishedAt)}
                        </div>
                        <h3 className="font-bold text-xl text-black group-hover:text-amber-600 font-serif leading-snug transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5C564E] line-clamp-2 leading-relaxed font-light">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/20">
                        <Image
                          src={
                            post.coverImage?.url ||
                            "https://placehold.co/800x400/e2dcd5/7a736e?text=Boospace+Blog"
                          }
                          alt={post.title}
                          fill
                          className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* SLIDE 11: PRE-FOOTER (Sunset Banner) */}
            <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center bg-black overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-gradient-radial from-[#FF8A00]/15 to-transparent blur-3xl -translate-y-[80%]" />
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
                  <h3 className="text-2xl sm:text-3xl font-normal font-serif leading-relaxed italic text-white/90">
                    &quot;{config.manifesto_quote}&quot;
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-mono uppercase tracking-widest mt-4">
                    BOOSPACE STUDIOS • © 2026 DECENTRALIZED DATA
                  </p>
                </div>
                <div className="w-72 shrink-0">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black rounded-xl py-4 font-mono uppercase text-xs font-bold tracking-wider"
                  >
                    <Link href="/shop">ORDER NOW</Link>
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
