"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

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
  const [mounted, setMounted] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  // Sử dụng dữ liệu thực tế từ Supabase
  const videoUrl = heroVideo || "";
  const bgImageUrl = heroImage || "";

  return (
    <section
      className="relative min-h-screen w-screen flex items-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined }}
    >
      <div className="absolute inset-0 bg-black/45 z-0" />

      <div className="mx-auto max-w-[1440px] w-full h-[85vh] flex flex-col justify-between relative z-10 p-6 sm:p-12 lg:p-16 text-white bg-black/5">
        <div className="flex justify-between items-start w-full">
          <MotionWrapper direction="down" delay={100}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FAF5F2] text-xs font-mono uppercase tracking-widest border border-white/20">
              <span className="size-2 rounded-full bg-[#3ECF8E] animate-pulse" />
              SẢN PHẨM NỔI BẬT
            </div>
          </MotionWrapper>
        </div>

        {/* TIÊU ĐỀ & MÔ TẢ NẠP 100% TỪ SUPABASE */}
        <div className="max-w-3xl space-y-6 pt-16 text-left">
          <MotionWrapper direction="up" delay={200}>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05] font-serif text-drop-shadow">
              {featuredHeading ? (
                featuredHeading
              ) : (
                <>
                  Không gian độc bản.
                  <br />
                  <span className="text-[#3ECF8E] italic font-medium font-serif">
                    Thân thiện và Tinh tế.
                  </span>
                </>
              )}
            </h1>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={300}>
            <p className="text-base sm:text-lg text-neutral-100 leading-relaxed max-w-lg font-sans text-drop-shadow font-medium">
              {featuredDesc || heroSubtitle || ""}
            </p>
          </MotionWrapper>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8 pt-12">
          {/* KHUNG VIDEO HERO */}
          <MotionWrapper direction="right" delay={400}>
            <div className="relative w-48 sm:w-64 aspect-[16/10] rounded-2xl overflow-hidden border-2 border-[#3ECF8E] bg-black/40 group cursor-pointer shadow-lg flex items-center justify-center">
              {!mounted || videoError || !videoUrl ? (
                bgImageUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
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
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
                />
              )}
            </div>
          </MotionWrapper>

          {/* KHUNG ĐĂNG KÝ BẢN TIN & NÚT KHÁM PHÁ */}
          <div className="space-y-4 max-w-sm w-full text-left">
            {!isClosed && (
              <MotionWrapper direction="left" delay={450}>
                <div className="bg-white/95 backdrop-blur-md text-black p-5 rounded-2xl border border-white/20 shadow-xl relative space-y-3">
                  <button
                    onClick={() => setIsClosed(true)}
                    aria-label="Đóng biểu mẫu bản tin"
                    className="absolute top-3 right-3 text-xs text-slate-500 cursor-pointer hover:text-black transition-colors"
                  >
                    ✕
                  </button>
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-black font-sans">
                      Bản tin Boo Space
                    </p>
                    <p className="text-[10px] text-[#2D2A26] font-mono tracking-wider font-bold">
                      NHẬN CẢM HỨNG KHÔNG GIAN · KHÔNG SPAM
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubscribe}
                    className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-300"
                  >
                    <input
                      type="email"
                      placeholder="E-MAIL"
                      aria-label="Địa chỉ Email đăng ký nhận thông tin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-transparent px-3 py-2 text-xs font-mono tracking-wider outline-none text-black placeholder:text-slate-600 font-medium"
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
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl border border-[#FF9D00] shadow-sm"
              >
                KHÁM PHÁ BỘ SƯU TẬP <ArrowRight className="size-4 text-black" />
              </MagneticButton>
              <p className="text-center text-xs text-white font-mono tracking-wider font-semibold">
                ✓ Miễn phí vận chuyển nội thành TP. Hồ Chí Minh
              </p>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
