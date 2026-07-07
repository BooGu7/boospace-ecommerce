"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { toast } from "sonner";

interface HeroVideoSectionProps {
  heroImage: string;
  heroVideo: string;
  heroSubtitle: string;
}

export function HeroVideoSection({
  heroImage,
  heroVideo,
  heroSubtitle,
}: HeroVideoSectionProps) {
  const [orderLoading, setOrderLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState(false);

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    // Giả lập thời gian nạp đơn hàng trước khi chuyển tiếp
    setTimeout(() => {
      window.location.href = "/shop";
    }, 1200);
  };

  // Tiến trình đăng ký bản tin từ góc Hero Section gửi lên Supabase
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Đăng ký nhận bản tin thành công! ✨");
        setEmail("");
        setIsClosed(true); // Tự động đóng bản tin sau khi đăng ký thành công
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

  return (
    <section
      className="relative min-h-screen w-screen flex items-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Lớp phủ mờ bảo vệ độ tương phản của chữ */}
      <div className="absolute inset-0 bg-black/45 z-0" />

      <div className="mx-auto max-w-[1440px] w-full h-[85vh] flex flex-col justify-between relative z-10 p-6 sm:p-12 lg:p-16 text-white bg-black/5">
        {/* Header phụ mộc mạc */}
        <div className="flex justify-between items-start w-full">
          <MotionWrapper direction="down" delay={100}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FAF5F2] text-xs font-mono uppercase tracking-widest border border-white/20">
              <span className="size-2 rounded-full bg-[#3ECF8E] animate-pulse" />
              SẢN PHẨM NỔI BẬT
            </div>
          </MotionWrapper>
        </div>

        {/* Tiêu đề & Mô tả Việt hóa hoàn chỉnh */}
        <div className="max-w-3xl space-y-6 pt-16">
          <MotionWrapper direction="up" delay={200}>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05] font-serif text-drop-shadow">
              Mảng xanh độc bản,
              <br />
              <span className="text-[#3ECF8E] italic font-medium font-serif">
                thân thiện và tinh tế.
              </span>
            </h1>
          </MotionWrapper>
          <MotionWrapper direction="up" delay={300}>
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-lg font-sans text-drop-shadow">
              Định nghĩa lại góc làm việc bằng những chiếc{" "}
              <span className="text-[#3ECF8E] font-medium">chậu cây in 3D</span>{" "}
              mang ngôn ngữ thiết kế hiện đại. Chất liệu sinh học lành tính,
              kiểu dáng thẩm mỹ cao giúp dọn dẹp mọi xao nhãng số, trả lại sự
              tĩnh lặng thuần khiết bên cạnh hạ tầng.
            </p>
          </MotionWrapper>
        </div>

        {/* Chân trang Hero (Khung Video lặp ngầm & Button Order) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8 pt-12">
          {/* Khung phát Video lặp lại thời gian thực từ Supabase Storage */}
          <MotionWrapper direction="right" delay={400}>
            <div className="relative w-48 sm:w-64 aspect-[16/10] rounded-2xl overflow-hidden border-2 border-[#3ECF8E] bg-black/40 group cursor-pointer shadow-lg">
              <video
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </MotionWrapper>

          <div className="space-y-4 max-w-sm w-full">
            {/* Form Newsletter nhỏ gọn (Sẽ ẩn mượt mà sau khi đăng ký thành công hoặc tắt) */}
            {!isClosed && (
              <MotionWrapper direction="left" delay={450}>
                <div className="bg-white/95 backdrop-blur-md text-black p-5 rounded-2xl border border-white/20 shadow-xl relative space-y-3">
                  <button
                    onClick={() => setIsClosed(true)}
                    className="absolute top-3 right-3 text-xs text-slate-400 cursor-pointer hover:text-black transition-colors"
                  >
                    ✕
                  </button>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-800 font-sans">
                      Bản tin Boo Space
                    </h4>
                    <p className="text-[9px] text-[#786F66] font-mono tracking-wider font-semibold">
                      ĐĂNG KÝ NHẬN TIN · KHÔNG SPAM
                    </p>
                  </div>

                  {/* Form tương tác kết nối trực tiếp với Supabase */}
                  <form
                    onSubmit={handleSubscribe}
                    className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200"
                  >
                    <input
                      type="email"
                      placeholder="E-MAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-transparent px-3 py-2 text-xs font-mono tracking-wider outline-none text-black placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-black hover:bg-slate-800 text-[10px] font-mono font-bold tracking-widest text-white px-3.5 py-2 uppercase shadow-sm transition-all shrink-0 cursor-pointer"
                    >
                      {submitting ? "..." : "ĐĂNG KÍ"}
                    </button>
                  </form>
                </div>
              </MotionWrapper>
            )}

            {/* Lệnh Order Now khổng lồ màu xanh Supabase tích hợp HÚT CHUỘT MAGNETIC */}
            <MotionWrapper direction="up" delay={500} className="space-y-2">
              <MagneticButton
                onClick={handleOrderClick}
                loading={orderLoading}
                className="w-full bg-[#3ECF8E] hover:bg-[#2eb87b] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl border border-[#3ECF8E] shadow-sm"
              >
                ĐẶT HÀNG NGAY <ArrowRight className="size-4 text-black" />
              </MagneticButton>
              <p className="text-center text-[10px] text-white/70 font-mono tracking-wider">
                {"✓"} CÒN HÀNG {"·"} VẬN CHUYỂN TRONG 3-5 NGÀY
              </p>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
