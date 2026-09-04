"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Droplets,
  Feather,
  Heart,
  Home,
  Layers,
  Leaf,
  Monitor,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { BentoPortalGrid } from "./bento-portal-grid";
import { HeroVideoSection } from "./hero-video-section";
import { HowItWorks, type StepItem } from "./how-it-works";
import { Button } from "@/components/ui/button";
import type { BlogPost, Category, Product } from "@/types";

interface MainHorizontalScrollProps {
  categories: Category[];
  featuredProducts: Product[];
  saleProducts: Product[];
  blogs: BlogPost[];
  config: Record<string, unknown>;
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

const SPACES_MAP: Record<string, { name: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; slug: string }> = {
  all: { name: "Tất cả", icon: Sparkles, color: "text-amber-700", bg: "bg-amber-100/70", slug: "all" },
  workspace: { name: "Work — Góc Sáng Tạo", icon: Monitor, color: "text-blue-700", bg: "bg-blue-100/70", slug: "workspace" },
  "smart-planters": { name: "Green — Sống Gần Thiên Nhiên", icon: Leaf, color: "text-emerald-700", bg: "bg-emerald-100/70", slug: "smart-planters" },
  "ambient-lights": { name: "Rest — Khoảnh Khắc Thư Giãn", icon: Moon, color: "text-amber-700", bg: "bg-amber-100/70", slug: "ambient-lights" },
  "home-decor": { name: "Home — Dấu Ấn Cá Nhân", icon: Home, color: "text-rose-700", bg: "bg-rose-100/70", slug: "home-decor" },
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

  const [activeSpaceFilter, setActiveSpaceFilter] = useState<string>("all");

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

  const manifestoHeading =
    typeof config.manifesto_heading === "string"
      ? config.manifesto_heading
      : "Chúng tôi tin rằng một không gian đáng sống không cần phải thật nhiều thứ.";
  const manifestoDesc =
    typeof config.manifesto_desc === "string"
      ? config.manifesto_desc
      : "Một vùng ánh sáng ấm. Một mảng xanh nhỏ. Một chiếc bàn gọn gàng. Một tác phẩm được đặt đúng chỗ.\n\nNhững điều nhỏ ấy có thể thay đổi cảm giác của cả một không gian sống.\n\nBoo Space tạo ra những tác phẩm thiết kế cho những khoảnh khắc rất đời thường — làm việc, sáng tạo, nghỉ ngơi và tận hưởng.";

  const slide1Tag = (config.slide1_tag as string) || "REST — KHOẢNH KHẮC THƯ GIÃN";
  const slide1Title =
    (config.slide1_title as string) || "Liệu pháp thị giác cho những đêm tư duy sâu";
  const slide1Desc =
    (config.slide1_desc as string) ||
    "Loại bỏ hoàn toàn những nguồn sáng gắt gây căng thẳng thị giác. Chúng tôi ứng dụng cấu trúc tán xạ ánh sáng tự nhiên để biến nguồn sáng thô thành vệt sáng ấm áp, bảo vệ đôi mắt và đem lại sự bình yên trong tâm hồn bạn mỗi đêm.";
  const slide1Image =
    (config.slide1_image as string) || (config.diy_image as string) || "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/2-1787021002298.jpg";

  const slide2Tag = (config.slide2_tag as string) || "GREEN — SỐNG GẦN THIÊN NHIÊN";
  const slide2Title =
    (config.slide2_title as string) || "Khi thiên nhiên đồng hành cùng sự ngăn nắp";
  const slide2Desc =
    (config.slide2_desc as string) ||
    "Một mầm sống nhỏ trên bàn làm việc là bộ lọc tự nhiên giải tỏa áp lực tinh thần. Dòng chậu cây tối giản tích hợp ngăn chứa nước thông minh, giữ cho mặt bàn luôn khô ráo, sạch sẽ và thanh lịch mà không đòi hỏi chăm sóc cầu kỳ.";
  const slide2Image =
    (config.slide2_image as string) || (config.tech_image as string) || "https://amukhgkamrokbbcjgusf.supabase.co/storage/v1/object/public/product-images/assets/1787020404841-ug5le.jpg";

  const prefooterTitle =
    typeof config.prefooter_title === "string"
      ? config.prefooter_title
      : "“Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay hôm nay.”";
  const prefooterNote =
    typeof config.prefooter_note === "string"
      ? config.prefooter_note
      : "Sản phẩm được chế tác tỉ mỉ, bền bỉ cùng thời gian và kháng ẩm tự nhiên. Miễn phí vận chuyển nội thành TP.HCM & đơn hàng từ 500.000 ₫.";

  const hasSaleProducts = saleProducts && saleProducts.length > 0;
  const containerHeightClass = hasSaleProducts ? "h-[1300vh]" : "h-[1200vh]";
  const containerWidthClass = hasSaleProducts ? "w-[1300vw]" : "w-[1200vw]";
  const maxTranslateX = hasSaleProducts ? "-92.3%" : "-91.66%";

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

  const defaultHowItWorksSteps: StepItem[] = [
    {
      num: "01",
      title: "Chọn Mẫu & Tone Màu",
      desc: "Lựa chọn kiểu dáng bạn yêu thích từ Boo Space và tinh chỉnh gam màu ấm áp hòa hợp với không gian phòng bạn.",
    },
    {
      num: "02",
      title: "Tạo Hình Liền Khối",
      desc: "Tác phẩm được kiến tạo từng đường nét tỉ mỉ, dệt nên hình khối mềm mại, liền mạch và vững chãi.",
    },
    {
      num: "03",
      title: "Hoàn Thiện Tinh Tế",
      desc: "Chăm chút thủ công từng chi tiết nhỏ, làm mịn bề mặt, kiểm tra độ hoàn hảo và đóng gói nâng niu gửi đến bạn.",
    },
  ];

  const howItWorksSteps = Array.isArray(config?.how_it_works_steps) && config.how_it_works_steps.length > 0
    ? (config.how_it_works_steps as StepItem[])
    : defaultHowItWorksSteps;

  // LỌC SẢN PHẨM THEO TAB KHÔNG GIAN SỐNG
  const filteredProducts = featuredProducts.filter((prod) => {
    if (activeSpaceFilter === "all") return true;
    const cat = categories.find((c) => c.slug === activeSpaceFilter);
    if (!cat) return true;
    return prod.categoryIds?.includes(cat.id);
  });

  const craftFeatures = [
    {
      title: "Nhẹ Nhàng & Bền Chắc",
      subtitle: "Cấu trúc vi mô vững chãi",
      desc: "Cấu trúc uốn lượn ẩn sâu bên trong giúp tác phẩm nhẹ tênh trên bàn tay nhưng vô cùng bền bỉ, không sợ rơi vỡ hay biến dạng qua năm tháng.",
      icon: Feather,
      color: "from-amber-500/20 to-amber-700/10",
      badge: "Cấu Trúc",
    },
    {
      title: "Bền Bỉ Cùng Thời Gian",
      subtitle: "Chất liệu cao cấp & thân thiện",
      desc: "Không bị phai màu hay giòn gãy dưới ánh nắng ban trưa, chống ẩm mốc tự nhiên, luôn giữ trọn vẻ đẹp ban đầu trong mọi điều kiện sống.",
      icon: Sun,
      color: "from-rose-500/20 to-orange-700/10",
      badge: "Độ Bền",
    },
    {
      title: "Chạm Vào Ấm Áp",
      subtitle: "Bề mặt nhám mịn tựa gốm mộc",
      desc: "Từng đường nét được xử lý tỉ mỉ mang lại cảm giác mờ lì êm ái, chạm vào ấm tay và hoàn toàn không để lại vết mồ hôi hay dấu vân tay.",
      icon: Sparkles,
      color: "from-emerald-500/20 to-teal-700/10",
      badge: "Cảm Giác",
    },
    {
      title: "Kháng Nước Tự Nhiên",
      subtitle: "Tạo hình liền khối không mối nối",
      desc: "Thiết kế nguyên khối không khe hở giúp tác phẩm kháng nước tự nhiên, an tâm tuyệt đối khi tưới cây xanh hay đặt những tách trà nóng.",
      icon: Droplets,
      color: "from-blue-500/20 to-cyan-700/10",
      badge: "Công Năng",
    },
  ];

  return (
    <>
      {/* =========================================================================
         1. BỐ CỤC MOBILE & TABLET (block lg:hidden)
         ========================================================================= */}
      <div className="block lg:hidden space-y-16 bg-[#FAF7F0] text-[#1E1C1A]">
        <HeroVideoSection
          heroImage={
            typeof config.hero_image === "string"
              ? config.hero_image
              : undefined
          }
          heroVideo={
            typeof config.hero_video === "string"
              ? config.hero_video
              : undefined
          }
          heroSubtitle={
            typeof config.hero_subtitle === "string"
              ? config.hero_subtitle
              : undefined
          }
          featuredHeading={
            typeof config.featured_heading === "string"
              ? config.featured_heading
              : undefined
          }
          featuredDesc={
            typeof config.featured_desc === "string"
              ? config.featured_desc
              : undefined
          }
          onExploreClick={() => router.push("/shop")}
        />

        {/* CÂU CHUYỆN THƯƠNG HIỆU (MANIFESTO) */}
        {manifestoHeading && (
          <section className="bg-gradient-to-b from-[#F4EFE6] to-[#EAE4D8] py-16 px-6 text-center border-y border-[#E1DDD5] relative overflow-hidden shadow-inner">
            <div className="absolute -top-12 -left-12 size-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 size-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-3xl mx-auto text-left sm:text-center">
              <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
                BRAND MANIFESTO • BOO SPACE
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-relaxed tracking-tight text-[#1E1C1A]">
                {manifestoHeading}
              </h2>
              {manifestoDesc && (
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#5C564E] leading-relaxed max-w-2xl mx-auto font-normal pt-4 border-t border-[#E1DDD5]/80 whitespace-pre-line">
                  {manifestoDesc}
                </p>
              )}
            </div>
          </section>
        )}

        {/* TRIẾT LÝ THIẾT KẾ: FUNCTION - BEAUTY - EMOTION */}
        <section className="px-6 py-8 max-w-4xl mx-auto">
          <div className="border-b pb-4 border-[#E1DDD5] mb-8 text-left">
            <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
              DESIGN PHILOSOPHY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black font-serif mt-1">
              Triết lý thiết kế của Boo
            </h2>
            <p className="text-xs text-[#5C564E] mt-1 font-mono uppercase tracking-wider">
              HỮU ÍCH • ĐẸP • CẢM XÚC (FUNCTION — BEAUTY — EMOTION)
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
            <div className="p-7 bg-white/80 backdrop-blur-md border border-[#E1DDD5] rounded-3xl space-y-3.5 text-left shadow-sm hover:shadow-md hover:border-amber-400 transition-all">
              <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow-xs">
                <Layers className="size-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-black">Hữu ích (Function)</h3>
              <p className="text-xs text-[#5C564E] leading-relaxed font-sans">
                Các thiết kế được kiến tạo để giải quyết bài toán không gian thực tế: tổ chức bàn làm việc ngăn nắp, điều phối ánh sáng và mang mảng xanh vào phòng.
              </p>
            </div>

            <div className="p-7 bg-white/80 backdrop-blur-md border border-[#E1DDD5] rounded-3xl space-y-3.5 text-left shadow-sm hover:shadow-md hover:border-emerald-400 transition-all">
              <div className="size-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-xs">
                <Sparkles className="size-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-black">Đẹp (Beauty)</h3>
              <p className="text-xs text-[#5C564E] leading-relaxed font-sans">
                Hình dáng tinh gọn với đường cong mềm mại Soft Geometry, màu sắc trung tính tự nhiên (trắng kem, gỗ ấm, xanh olive) tôn vinh vẻ đẹp thanh lịch.
              </p>
            </div>

            <div className="p-7 bg-white/80 backdrop-blur-md border border-[#E1DDD5] rounded-3xl space-y-3.5 text-left shadow-sm hover:shadow-md hover:border-rose-400 transition-all">
              <div className="size-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 shadow-xs">
                <Heart className="size-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-black">Cảm xúc (Emotion)</h3>
              <p className="text-xs text-[#5C564E] leading-relaxed font-sans">
                Bề mặt mịn mát mộc mạc như gốm sứ, ánh sáng dịu xoa dịu đôi mắt. Giúp bạn luôn tìm thấy khoảnh khắc tĩnh lặng và bình yên giữa nhịp sống hối hả.
              </p>
            </div>
          </div>
        </section>

        {/* 4 KHÔNG GIAN SỐNG (BOO SPACES) */}
        <section className="px-6 py-12 max-w-4xl mx-auto">
          <div className="border-b pb-4 border-[#E1DDD5] mb-8 text-left">
            <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
              BOO SPACES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black font-serif mt-1">
              4 Không gian sống Boo Space
            </h2>
            <p className="text-xs text-[#5C564E] mt-1 font-sans">
              Giải pháp bài trí không gian trọn vẹn cho từng khoảnh khắc trong ngôi nhà bạn.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-square rounded-[32px] overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/40 shadow-sm hover:shadow-xl transition-all"
              >
                <Image
                  src={cat.image?.url || slide1Image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover mix-blend-multiply opacity-85 group-hover:scale-106 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-7 text-white text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                    KHÔNG GIAN
                  </span>
                  <h3 className="text-2xl font-bold font-serif mt-1 text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-200 font-sans mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {cat.description ||
                      `Khám phá các thiết kế không gian độc bản thuộc bộ sưu tập ${cat.name}.`}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-[#FF9D00] hover:text-black backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/30 transition-all w-fit shadow-xs">
                    Khám phá không gian →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SPOTLIGHT SẢN PHẨM VỚI BỘ LỌC KHÔNG GIAN TƯƠNG TÁC */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="px-6 py-12 bg-white/70 border-y border-[#E1DDD5]">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-6 border-[#E1DDD5] gap-4 text-left">
                <div>
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
                    FEATURED OBJECTS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-black font-serif mt-1">
                    Tác phẩm thiết kế nổi bật
                  </h2>
                </div>

                {/* TABS LỌC KHÔNG GIAN */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#E1DDD5]">
                  {Object.entries(SPACES_MAP).map(([key, space]) => {
                    const isActive = activeSpaceFilter === key;
                    const Icon = space.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveSpaceFilter(key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isActive
                            ? "bg-black text-white shadow-xs"
                            : "text-[#5C564E] hover:text-black hover:bg-white"
                        }`}
                      >
                        <Icon className="size-3" />
                        <span>{space.name.split("—")[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GRID SẢN PHẨM ĐÃ LỌC */}
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={prod} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>
        )}

        {/* ĐẶC TÍNH CHẾ TÁC LIFESTYLE */}
        <section className="px-6 py-12 max-w-4xl mx-auto text-left space-y-8">
          <div className="border-b pb-4 border-[#E1DDD5]">
            <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
              CRAFT &amp; LIVING
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black font-serif mt-1">
              Vẻ đẹp của sự Tinh giản &amp; Bền bỉ
            </h2>
            <p className="text-xs text-[#5C564E] mt-1 font-sans">
              Những tác phẩm được tạo tác với sự chăm chút cho cảm giác sống ấm áp mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {craftFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-3xl bg-white border border-[#E1DDD5] shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-black">{feat.title}</h3>
                    <p className="text-[11px] font-mono text-[#786F66] uppercase tracking-wider">{feat.subtitle}</p>
                  </div>

                  <p className="text-xs text-[#5C564E] leading-relaxed font-sans pt-1 border-t border-[#E1DDD5]/60">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* QUY TRÌNH CHẾ TÁC */}
        <section className="px-6 py-12 bg-[#F4EFE6] border-y border-[#E1DDD5] text-left">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-b pb-4 border-[#E1DDD5]">
              <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
                MADE BY BOO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-black font-serif mt-1">
                Từ bản vẽ ý tưởng đến tác phẩm hiện hữu
              </h2>
            </div>

            <div className="space-y-6">
              {howItWorksSteps.map((step, idx) => (
                <div
                  key={step.num || idx}
                  className="p-7 bg-white/90 backdrop-blur-md border border-[#E1DDD5] rounded-3xl space-y-2 shadow-xs"
                >
                  <span className="text-3xl font-serif text-amber-600 font-bold block">
                    {step.num || `0${idx + 1}`}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-black">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#5C564E] leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NHẬT KÝ */}
        <section className="px-6 py-12 max-w-4xl mx-auto">
          <div className="flex justify-between items-end border-b pb-4 border-[#E1DDD5] mb-8 text-left">
            <div>
              <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
                JOURNAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-black font-serif mt-1">
                Nhật ký hành trình
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-amber-600 font-bold"
            >
              Đọc nhật ký →
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {blogs?.slice(0, 3).map((post, idx) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="space-y-3 text-left group"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-xs">
                  <Image
                    src={
                      post.coverImage?.url ||
                      "https://placehold.co/800x400/e2dcd5/7a736e?text=Boospace+Blog"
                    }
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="text-[10px] font-mono text-[#786F66]">
                  0{idx + 1} / {formatVNDateString(post.publishedAt)}
                </div>
                <h3 className="font-bold text-base font-serif text-black group-hover:text-amber-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-6 py-12 max-w-4xl mx-auto">
          <BentoPortalGrid />
        </section>
      </div>

      {/* =========================================================================
         2. BỐ CỤC CUỘN NGANG DESKTOP (hidden lg:block)
         ========================================================================= */}
      <motion.div
        ref={containerRef}
        className={`hidden lg:block relative w-full ${containerHeightClass}`}
      >
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-emerald-500 to-rose-500 origin-left z-50 shadow-sm"
          style={{ scaleX }}
        />

        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E1DDD5_1px,transparent_1px),linear-gradient(to_bottom,#E1DDD5_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          <motion.div
            style={{ x }}
            className={`flex h-full items-center ${containerWidthClass}`}
          >
            {/* SLIDE 1: HERO SECTION */}
            <div className="w-[100vw] h-full shrink-0 relative flex items-center justify-center border-r border-[#E1DDD5]/50 bg-[#FAF7F0]">
              <HeroVideoSection
                heroImage={
                  typeof config.hero_image === "string"
                    ? config.hero_image
                    : undefined
                }
                heroVideo={
                  typeof config.hero_video === "string"
                    ? config.hero_video
                    : undefined
                }
                heroSubtitle={
                  typeof config.hero_subtitle === "string"
                    ? config.hero_subtitle
                    : undefined
                }
                featuredHeading={
                  typeof config.featured_heading === "string"
                    ? config.featured_heading
                    : undefined
                }
                featuredDesc={
                  typeof config.featured_desc === "string"
                    ? config.featured_desc
                    : undefined
                }
                onExploreClick={() => router.push("/shop")}
              />
            </div>

            {/* SLIDE 2: BRAND MANIFESTO */}
            {manifestoHeading && (
              <div className="w-[100vw] h-full shrink-0 relative flex flex-col items-center justify-center px-16 border-r border-[#E1DDD5]/50 bg-gradient-to-br from-[#F5F0E6] to-[#EBE4D6] overflow-hidden">
                <div className="absolute top-1/4 left-1/3 size-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/3 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                  variants={textFadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="max-w-5xl w-full text-center space-y-8 relative z-10 p-12 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60 shadow-xl"
                >
                  <span className="text-[11px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    BRAND MANIFESTO • BOO SPACE
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#1E1C1A] leading-[1.25] max-w-4xl mx-auto">
                    {manifestoHeading}
                  </h2>
                  {manifestoDesc && (
                    <p className="font-sans text-base lg:text-lg text-[#5C564E] leading-relaxed max-w-2xl mx-auto font-normal pt-6 border-t border-[#E1DDD5]/80 whitespace-pre-line">
                      {manifestoDesc}
                    </p>
                  )}
                </motion.div>
              </div>
            )}

            {/* SLIDE 3: TRIẾT LÝ THIẾT KẾ (DESIGN PHILOSOPHY) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FAF7F0] relative">
              <div className="mx-auto max-w-7xl w-full text-left space-y-12">
                <div>
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    DESIGN PHILOSOPHY
                  </span>
                  <h2 className="text-4xl font-bold font-serif text-black mt-2">
                    Triết lý thiết kế của Boo
                  </h2>
                  <p className="text-xs text-[#5C564E] mt-1 font-mono uppercase tracking-wider">
                    HỮU ÍCH • ĐẸP • CẢM XÚC (FUNCTION — BEAUTY — EMOTION)
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="p-8 bg-white/80 backdrop-blur-md border border-[#E1DDD5] rounded-[32px] space-y-4 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all">
                    <div className="size-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow-xs">
                      <Layers className="size-7" />
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-black">Hữu ích (Function)</h3>
                    <p className="text-sm text-[#5C564E] leading-relaxed font-sans">
                      Thiết kế giải quyết bài toán không gian thực tế: khay giấu dây, chậu cây tự tưới và các phụ kiện modular giúp mặt bàn luôn ngăn nắp, tinh gọn.
                    </p>
                  </div>

                  <div className="p-8 bg-white/80 backdrop-blur-md border border-[#E1DDD5] rounded-[32px] space-y-4 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all">
                    <div className="size-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-xs">
                      <Sparkles className="size-7" />
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-black">Đẹp (Beauty)</h3>
                    <p className="text-sm text-[#5C564E] leading-relaxed font-sans">
                      Hình khối tinh gọn Soft Geometry kết hợp bảng màu thiên nhiên (trắng kem, gỗ ấm, xanh olive) kiến tạo vẻ đẹp thanh tao và có gu thẩm mỹ cao.
                    </p>
                  </div>

                  <div className="p-8 bg-white/80 backdrop-blur-md border border-[#E1DDD5] rounded-[32px] space-y-4 shadow-sm hover:shadow-xl hover:border-rose-400 transition-all">
                    <div className="size-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 shadow-xs">
                      <Heart className="size-7" />
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-black">Cảm xúc (Emotion)</h3>
                    <p className="text-sm text-[#5C564E] leading-relaxed font-sans">
                      Bề mặt mịn màng tựa gốm sứ thủ công, ánh sáng dịu êm. Giúp bạn luôn tìm thấy khoảnh khắc bình yên và cảm hứng sáng tạo trong không gian riêng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 4: REST - ÁNH SÁNG KHÚC XẠ */}
            {slide1Title && (
              <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-gradient-to-br from-[#FAF7F0] to-[#F2EADB]">
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
                      <p className="text-base text-[#5C564E] leading-relaxed max-w-md font-sans">
                        {slide1Desc}
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    variants={imageParallax}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="col-span-6 relative aspect-square w-full rounded-[36px] overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
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

            {/* SLIDE 5: GREEN - MẢNG XANH THÔNG MINH */}
            {slide2Title && (
              <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-gradient-to-br from-[#FAF7F0] to-[#E8F0E6]">
                <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                  <motion.div
                    variants={textFadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="col-span-6 space-y-6 text-left"
                  >
                    <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-widest font-bold">
                      {slide2Tag}
                    </span>
                    <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                      {slide2Title}
                    </h2>
                    {slide2Desc && (
                      <p className="text-base text-[#5C564E] leading-relaxed max-w-md font-sans">
                        {slide2Desc}
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    variants={imageParallax}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="col-span-6 relative aspect-square w-full rounded-[36px] overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl"
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

            {/* SLIDE 6: 4 KHÔNG GIAN SỐNG (BOO SPACES) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FAF7F0]">
              <div className="w-full max-w-7xl">
                <div className="border-b pb-6 border-[#E1DDD5] mb-8 text-left flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      BOO SPACES
                    </span>
                    <h2 className="text-4xl font-bold text-black font-serif mt-2">
                      4 Không gian sống Boo Space
                    </h2>
                    <p className="text-xs text-[#5C564E] font-sans mt-1">
                      Work — Green — Rest — Home
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 grid-cols-4">
                  {categories.map((cat) => (
                    <motion.div key={cat.id} whileHover={{ y: -10 }}>
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="group relative aspect-[3/4] rounded-[32px] overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/40 shadow-sm transition-all hover:border-black block hover:shadow-2xl"
                      >
                        <Image
                          src={cat.image?.url || slide1Image}
                          alt={cat.name}
                          fill
                          sizes="25vw"
                          className="object-cover mix-blend-multiply opacity-85 group-hover:opacity-95 group-hover:scale-108 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-7 text-white text-left">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                            KHÔNG GIAN
                          </span>
                          <h3 className="text-2xl text-white font-bold font-serif mt-1">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-neutral-200 font-sans mt-2 line-clamp-2 leading-relaxed font-medium">
                            {cat.description ||
                              `Khám phá các thiết kế không gian độc bản thuộc bộ sưu tập ${cat.name}.`}
                          </p>
                          <span className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-mono font-bold text-amber-300 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 w-fit group-hover:bg-amber-400/20 group-hover:border-amber-400/40 transition-all">
                            Khám phá không gian →
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* SLIDE 7: SẢN PHẨM NỔI BẬT VỚI BỘ LỌC TƯƠNG TÁC */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-white/60 relative overflow-hidden">
              <div className="w-full max-w-7xl relative z-10 space-y-8">
                <div className="flex justify-between items-end border-b pb-6 border-[#E1DDD5] text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                      THE CORE PORTFOLIO
                    </span>
                    <h2 className="text-4xl font-bold text-black font-serif mt-2">
                      Tác phẩm thiết kế nổi bật
                    </h2>
                  </div>

                  {/* TABS LỌC KHÔNG GIAN TRÊN DESKTOP */}
                  <div className="flex items-center gap-2 bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#E1DDD5]">
                    {Object.entries(SPACES_MAP).map(([key, space]) => {
                      const isActive = activeSpaceFilter === key;
                      const Icon = space.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveSpaceFilter(key)}
                          className={`px-4 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isActive
                              ? "bg-black text-white shadow-sm"
                              : "text-[#5C564E] hover:text-black hover:bg-white"
                          }`}
                        >
                          <Icon className="size-3.5" />
                          <span>{space.name.split("—")[0].trim()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {filteredProducts.slice(0, 4).map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                <div className="flex justify-center pt-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#33302C] transition-all shadow-md hover:shadow-lg"
                  >
                    Xem toàn bộ bộ sưu tập →
                  </Link>
                </div>
              </div>
            </div>

            {/* SLIDE 8: ĐẶC TÍNH CHẾ TÁC LIFESTYLE */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FAF7F0]">
              <div className="w-full max-w-7xl text-left space-y-10">
                <div className="border-b pb-6 border-[#E1DDD5]">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    CRAFT &amp; LIVING
                  </span>
                  <h2 className="text-4xl font-bold font-serif text-black mt-2">
                    Vẻ đẹp của sự Tinh giản &amp; Bền bỉ
                  </h2>
                  <p className="text-xs text-[#5C564E] font-sans mt-1">
                    Những tác phẩm được tạo tác với sự chăm chút cho cảm giác sống ấm áp mỗi ngày.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {craftFeatures.map((feat) => {
                    const Icon = feat.icon;
                    return (
                      <div
                        key={feat.title}
                        className="p-7 rounded-[32px] bg-white border border-[#E1DDD5] shadow-sm hover:shadow-xl hover:border-amber-400 transition-all space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="size-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                            <Icon className="size-6" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
                            {feat.badge}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-xl text-black">{feat.title}</h3>
                          <p className="text-[11px] font-mono text-[#786F66] uppercase tracking-wider">{feat.subtitle}</p>
                        </div>

                        <p className="text-xs text-[#5C564E] leading-relaxed font-sans pt-2 border-t border-[#E1DDD5]/60">
                          {feat.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SLIDE 9: MADE BY BOO (QUY TRÌNH CHẾ TÁC) */}
            <HowItWorks
              steps={howItWorksSteps}
              title={
                typeof config?.how_it_works_title === "string"
                  ? config.how_it_works_title
                  : "Từ ý tưởng đến tác phẩm thật"
              }
              tagline={
                typeof config?.how_it_works_tagline === "string"
                  ? config.how_it_works_tagline
                  : "QUY TRÌNH TẠO TÁC TÁC PHẨM SỐNG"
              }
            />

            {/* SLIDE 10: SẢN PHẨM ƯU ĐÃI (NẾU CÓ) */}
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
                      className="text-xs font-mono uppercase tracking-widest text-red-600 hover:text-[#FF9D00] flex items-center gap-1.5 transition-colors font-bold"
                    >
                      Nhận ưu đãi →
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    {saleProducts.slice(0, 4).map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 11: NHẬT KÝ HÀNH TRÌNH */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FAF7F0]">
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
                    className="text-xs font-mono uppercase tracking-widest text-[#1E1C1A] hover:text-[#FF9D00] flex items-center gap-1.5 transition-colors font-bold"
                  >
                    Đọc nhật ký →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-0 border border-[#E1DDD5] bg-white divide-x divide-[#E1DDD5] rounded-[36px] overflow-hidden shadow-sm">
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
                        <h3 className="font-bold text-xl text-black group-hover:text-amber-700 font-serif leading-snug transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#5C564E] line-clamp-2 leading-relaxed font-sans">
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
                          sizes="33vw"
                          className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* SLIDE 12: CUSTOM STUDIO (BENTO GRID) */}
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-24 border-r border-[#E1DDD5]/50 bg-[#FAF7F0]">
              <div className="w-full max-w-7xl">
                <BentoPortalGrid />
              </div>
            </div>

            {/* SLIDE 13: PREFOOTER */}
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
                      BOO SPACE • TÁC PHẨM THIẾT KẾ CHO KHÔNG GIAN CÓ CẢM XÚC
                    </p>
                  </div>
                  <div className="w-72 shrink-0">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl py-4 font-mono uppercase text-xs font-bold tracking-wider cursor-pointer shadow-lg"
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
