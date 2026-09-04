"use client";

import { ArrowRight, Feather, Leaf, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { useHydrated } from "@/hooks/use-hydrated";

interface HeroVideoSectionProps {
  heroImage?: string;
  heroVideo?: string;
  heroSubtitle?: string;
  featuredHeading?: string;
  featuredDesc?: string;
  onExploreClick?: () => void;
}

export function HeroVideoSection({
  heroImage,
  heroVideo,
  heroSubtitle,
  featuredHeading,
  featuredDesc,
  onExploreClick,
}: HeroVideoSectionProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState(false);
  const mounted = useHydrated();
  const [videoError, setVideoError] = React.useState(false);

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreClick) {
      onExploreClick();
    } else {
      router.push("/shop");
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Đăng ký nhận tin thành công! ✨");
        setEmail("");
        setIsClosed(true);
      } else {
        toast.error(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  const videoUrl = heroVideo || "";
  const bgImageUrl = heroImage || "";

  return (
    <section
      className="relative min-h-screen w-screen flex items-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined }}
    >
      {/* LỚP PHỦ GRADIENT SÂU & AMBIENT GLOW */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30 z-0" />
      <div className="absolute top-1/4 left-1/4 size-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/3 right-1/4 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="mx-auto max-w-[1440px] w-full min-h-[88vh] flex flex-col justify-between relative z-10 p-6 sm:p-12 lg:p-16 text-white">
        {/* HEADER BADGE LIFESTYLE */}
        <div className="flex flex-wrap justify-between items-center w-full gap-4">
          <MotionWrapper direction="down" delay={100}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#FAF5F2] text-xs font-mono uppercase tracking-widest border border-white/20 shadow-lg">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
              <span>THIẾT KẾ CHO KHÔNG GIAN SỐNG • TP.HCM</span>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="down" delay={150}>
            <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-white/80 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Warm Minimalist Living Spaces</span>
            </div>
          </MotionWrapper>
        </div>

        {/* TIÊU ĐỀ & LỜI DẪN CẢM XÚC */}
        <div className="max-w-3xl space-y-6 pt-12 sm:pt-16 text-left">
          <MotionWrapper direction="up" delay={200}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] font-serif text-drop-shadow">
              {featuredHeading ? (
                featuredHeading
              ) : (
                <>
                  Những thiết kế tinh tế.
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent italic font-serif">
                    Những không gian có cảm xúc.
                  </span>
                </>
              )}
            </h1>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={300}>
            <p className="text-base sm:text-lg text-neutral-100 leading-relaxed max-w-xl font-sans text-drop-shadow font-normal opacity-95">
              {featuredDesc ||
                heroSubtitle ||
                "Boo Space tạo ra những tác phẩm thiết kế cho góc làm việc và không gian sống — ấm áp, tối giản và có chút xanh. Mỗi tác phẩm được hoàn thiện tỉ mỉ để bạn chạm vào và sống cùng với niềm an yên mỗi ngày."}
            </p>
          </MotionWrapper>

          {/* PILLS ĐẶC TÍNH CẢM XÚC & LIFESTYLE */}
          <MotionWrapper direction="up" delay={350}>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-white text-[11px] font-sans border border-white/15">
                <Sparkles className="size-3 text-amber-300" /> Bề Mặt Mịn Như Gốm Mộc
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-white text-[11px] font-sans border border-white/15">
                <Feather className="size-3 text-emerald-300" /> Đường Nét Mềm Mại Soft Geometry
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-white text-[11px] font-sans border border-white/15">
                <Leaf className="size-3 text-teal-300" /> Gần Gũi & Thân Thiện Cuộc Sống
              </span>
            </div>
          </MotionWrapper>
        </div>

        {/* BOTTOM CONTROLS: VIDEO THUMBNAIL + CTA */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8 pt-10">
          {/* KHUNG VIDEO HERO */}
          <MotionWrapper direction="right" delay={400}>
            <div className="relative w-48 sm:w-64 aspect-[16/10] rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-black/50 group cursor-pointer shadow-2xl flex items-center justify-center">
              {!mounted || videoError || !videoUrl ? (
                bgImageUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${bgImageUrl})` }}
                  />
                ) : null
              ) : (
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onError={() => setVideoError(true)}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono text-amber-200 uppercase tracking-widest font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />
                  QUY TRÌNH TẠO TÁC
                </span>
              </div>
            </div>
          </MotionWrapper>

          {/* KHUNG ĐĂNG KÝ BẢN TIN & NÚT KHÁM PHÁ */}
          <div className="space-y-4 max-w-sm w-full text-left">
            {!isClosed && (
              <MotionWrapper direction="left" delay={450}>
                <div className="bg-white/95 backdrop-blur-md text-black p-5 rounded-2xl border border-white/20 shadow-2xl relative space-y-3">
                  <button
                    onClick={() => setIsClosed(true)}
                    aria-label="Đóng biểu mẫu bản tin"
                    className="absolute top-3 right-3 text-xs text-slate-400 cursor-pointer hover:text-black transition-colors"
                  >
                    ✕
                  </button>
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-black font-serif">
                      Bản tin Boo Space
                    </p>
                    <p className="text-[10px] text-[#5C564E] font-mono tracking-wider font-bold">
                      NHẬN CẢM HỨNG KHÔNG GIAN · KHÔNG SPAM
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubscribe}
                    className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200"
                  >
                    <input
                      type="email"
                      placeholder="E-mail của bạn..."
                      aria-label="Địa chỉ Email đăng ký nhận thông tin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-transparent px-3 py-2 text-xs font-mono tracking-wider outline-none text-black placeholder:text-slate-500 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      aria-label="GET - Đăng ký nhận tin tức"
                      className="rounded-lg bg-black hover:bg-slate-800 text-[10px] font-mono font-bold tracking-widest text-white px-3.5 py-2 uppercase shadow-sm transition-all shrink-0 cursor-pointer"
                    >
                      {submitting ? "..." : "GET"}
                    </button>
                  </form>
                </div>
              </MotionWrapper>
            )}

            <MotionWrapper direction="up" delay={500} className="space-y-2">
              <MagneticButton
                onClick={handleExplore}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                KHÁM PHÁ BỘ SƯU TẬP <ArrowRight className="size-4 text-black" />
              </MagneticButton>
              <p className="text-center text-xs text-white/90 font-mono tracking-wider font-semibold">
                ✓ Miễn phí vận chuyển nội thành TP. Hồ Chí Minh
              </p>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
