"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HeroVideoSectionProps {
  heroImage: string;
  heroVideo: string;
  heroSubtitle: string;
  onExploreClick?: () => void; // Prop xử lý điều hướng thông suốt
}

export function HeroVideoSection({
  heroImage,
  heroVideo,
  heroSubtitle,
  onExploreClick,
}: HeroVideoSectionProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Khắc phục hoàn toàn lỗi lệch cấu trúc HTML (Hydration Mismatch) trong Next.js SSR
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Điều phối chuyển trang thông suốt về /shop
  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreClick) {
      onExploreClick();
    } else {
      router.push("/shop");
    }
  };

  // Tiến trình đăng ký bản tin góc trang lưu trực tiếp về Supabase
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
        toast.success(data.message || "Đăng ký nhận tin thành công! ✨");
        setEmail("");
        setIsClosed(true); // Ẩn mượt mà form sau khi đăng ký thành công
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
        {/* Header phụ mộc mạc không chứa chỉ mục số rườm rà */}
        <div className="flex justify-between items-start w-full">
          <MotionWrapper direction="down" delay={100}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FAF5F2] text-xs font-mono uppercase tracking-widest border border-white/20">
              <span className="size-2 rounded-full bg-[#3ECF8E] animate-pulse" />
              SẢN PHẨM NỔI BẬT
            </div>
          </MotionWrapper>
        </div>

        {/* Tiêu đề & Mô tả Việt hóa hoàn chỉnh chuẩn mực hãng đèn Cozy */}
        <div className="max-w-3xl space-y-6 pt-16 text-left">
          <MotionWrapper direction="up" delay={200}>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05] font-serif text-drop-shadow">
              Không gian độc bản.
              <br />
              <span className="text-[#3ECF8E] italic font-medium font-serif">
                Thân thiện và Tinh tế.
              </span>
            </h1>
          </MotionWrapper>
          <MotionWrapper direction="up" delay={300}>
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-lg font-sans text-drop-shadow">
              Định nghĩa lại góc sống bằng những chiếc đèn nghệ thuật và vật
              dụng in 3D mang ngôn ngữ tối giản. Chất liệu sinh học lành tính
              giúp dọn dẹp mọi xao nhãng số, trả lại sự ấm áp thuần khiết cho
              tâm trí.
            </p>
          </MotionWrapper>
        </div>

        {/* Chân trang Hero (Khung Video lặp ngầm & Button Explore) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8 pt-12">
          {/* Khung phát Video lặp chậm mượt mà nạp từ Supabase Storage */}
          <MotionWrapper direction="right" delay={400}>
            <div className="relative w-48 sm:w-64 aspect-[16/10] rounded-2xl overflow-hidden border-2 border-[#3ECF8E] bg-black/40 group cursor-pointer shadow-lg flex items-center justify-center">
              {!mounted ? (
                // Hiển thị vòng chờ quay mượt mà trong khi chờ Hydration hoàn tất
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-[#3ECF8E]" />
                </div>
              ) : (
                <video
                  key={heroVideo} // Tự động làm mới thẻ video nếu đường dẫn props thay đổi
                  src={heroVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-500"
                />
              )}
            </div>
          </MotionWrapper>

          <div className="space-y-4 max-w-sm w-full text-left">
            {/* Form Newsletter lồng dẹt gọn gàng */}
            {!isClosed && (
              <MotionWrapper direction="left" delay={450}>
                <div className="bg-white/95 backdrop-blur-md text-black p-5 rounded-2xl border border-white/20 shadow-xl relative space-y-3">
                  {/* Đã bổ sung aria-label cho phím Đóng ✕ [1.1] */}
                  <button
                    onClick={() => setIsClosed(true)}
                    aria-label="Đóng biểu mẫu bản tin"
                    className="absolute top-3 right-3 text-xs text-slate-400 cursor-pointer hover:text-black transition-colors"
                  >
                    ✕
                  </button>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-800 font-sans">
                      Bản tin Boo Space
                    </h4>
                    <p className="text-[9px] text-[#786F66] font-mono tracking-wider font-semibold">
                      NHẬN CẢM HỨNG KHÔNG GIAN · KHÔNG SPAM
                    </p>
                  </div>

                  {/* Form tương tác kết nối trực tiếp với Supabase */}
                  <form
                    onSubmit={handleSubscribe}
                    className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200"
                  >
                    {/* Đã bổ sung aria-label cho ô nhập email để tránh lỗi cản trở trình đọc màn hình [1.1] */}
                    <input
                      type="email"
                      placeholder="E-MAIL"
                      aria-label="Địa chỉ Email đăng ký nhận thông tin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-transparent px-3 py-2 text-xs font-mono tracking-wider outline-none text-black placeholder:text-slate-400"
                    />
                    {/* Đã bổ sung aria-label cho phím Gửi GET [1.1] */}
                    <button
                      type="submit"
                      disabled={submitting}
                      aria-label="Xác nhận gửi đăng ký Email"
                      className="rounded-lg bg-black hover:bg-slate-800 text-[10px] font-mono font-bold tracking-widest text-white px-3.5 py-2 uppercase shadow-sm transition-all shrink-0 cursor-pointer"
                    >
                      {submitting ? "..." : "GET"}
                    </button>
                  </form>
                </div>
              </MotionWrapper>
            )}

            {/* Phím bấm KHÁM PHÁ BỘ SƯU TẬP dẫn thẳng sang trang Shop */}
            <MotionWrapper direction="up" delay={500} className="space-y-2">
              <MagneticButton
                onClick={handleExplore}
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl border border-[#FF9D00] shadow-sm"
              >
                KHÁM PHÁ BỘ SƯU TẬP <ArrowRight className="size-4 text-black" />
              </MagneticButton>
              <p className="text-center text-[10px] text-white/70 font-mono tracking-wider">
                {"✓"} MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC TẠI VIỆT NAM
              </p>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}
