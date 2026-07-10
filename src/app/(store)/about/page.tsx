import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Layers } from "lucide-react";
import { Button } from "@/components/ui/button"; // Đã bổ sung dòng import chuẩn xác

export const metadata: Metadata = {
  title: "Về Boo Space — Studio Chế tác Workspace Độc Bản",
  description:
    "Studio thiết kế sản phẩm thủ công, phụ kiện DIY và các giải pháp tổ chức không gian làm việc in 3D tĩnh lặng theo yêu cầu.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* ==========================================
           HEADER SECTION PHONG CÁCH TỔNG BIÊN TẬP
           ========================================== */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
              05 / STUDIO MANIFESTO
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-black font-serif leading-none">
              Về Boo Space
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Xưởng chế tác của những kẻ mơ mộng thực tế
            </p>
          </div>
        </div>

        {/* ==========================================
           TUYÊN NGÔN GIÁ TRỊ (MANIFESTO BOLD TEXT)
           ========================================== */}
        <div className="max-w-4xl border-b border-[#E1DDD5]/60 pb-12 mb-16 text-left">
          <p className="font-serif text-2xl sm:text-3xl font-light text-black leading-relaxed italic">
            &quot;Boo Space ra đời từ một khát vọng giản đơn: dọn dẹp tiếng ồn
            số, mang sự mộc mạc của chất liệu vật lý và sự tĩnh lặng nguyên bản
            quay trở lại góc làm việc bận rộn hằng ngày của bạn.&quot;
          </p>
        </div>

        {/* ==========================================
           BỐ CỤC NỘI DUNG HAI CỘT LỆCH TẦNG (TACTILE GRID)
           ========================================== */}
        <div className="grid gap-16 lg:grid-cols-12 items-start">
          {/* CỘT TRÁI (KỂ CHUYỆN & TRIẾT LÝ) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            {/* Mục 1: Khởi đầu */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight">
                Hành trình đưa nét vẽ chạm vào thực tại
              </h3>
              <p className="text-sm leading-relaxed text-[#5C564E] font-sans">
                Boo Space hoạt động như một studio thiết kế không gian làm việc
                tự chủ, kết hợp tư duy DIY (Do It Yourself) mộc mạc với công
                nghệ in 3D hiện đại. Chúng tôi tin rằng mỗi món đồ đặt cạnh bàn
                phím của bạn không nên chỉ là những khối nhựa vô hồn, mà phải là
                một thực thể có ngôn ngữ thẩm mỹ riêng, kích thích cảm hứng sờ
                chạm vật lý và hỗ trợ năng lượng làm việc bền bỉ.
              </p>
            </div>

            {/* Mục 2: Triết lý */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight">
                Chúng tôi từ chối sự xao nhãng
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                Thế giới số đang bủa vây bạn bởi vô vàn thông báo đẩy và sự lộn
                xộn của dây cáp. Boo Space chế tác các giải pháp tối ưu hóa phần
                cứng, khay cắm dốc, kệ màn hình công thái học và chậu mầm sinh
                học để định hình lại trật tự bàn làm việc. Mỗi sản phẩm được
                thiết kế tỉ mỉ để phục vụ chính xác thói quen cá nhân của bạn,
                giúp cơ thể ngồi thẳng tự nhiên và tâm trí được tập trung sâu
                tuyệt đối.
              </p>
            </div>

            {/* Mục 3: Cam kết bảo vệ sức khỏe sinh học */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight">
                Chất liệu mộc và lành tính
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                Chúng tôi cam kết sử dụng các nguyên liệu thô thân thiện với môi
                trường và sức khỏe con người, bao gồm gỗ sồi tự nhiên sấy lò mài
                nhám mịn bằng tay, các chất liệu nhựa sinh học phân hủy hữu cơ
                (PLA chiết xuất từ tinh bột ngô), tạo nên một hệ sinh thái an
                toàn tuyệt đối cho không gian phòng kín của bạn.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI (CHỈ SỐ BẢNG THÔNG SỐ - SPEC SHEET) */}
          <div className="lg:col-span-5 space-y-8 bg-[#FAF5F2]/80 border border-[#E1DDD5] rounded-3xl p-8 shadow-xs text-left">
            <div className="space-y-2 pb-4 border-b border-[#E1DDD5]/60">
              <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-semibold">
                03 / SPECIFICATIONS
              </span>
              <h3 className="font-serif text-xl font-bold text-black">
                Tiêu chuẩn chế tác mộc
              </h3>
            </div>

            {/* Bảng thông số dẹt như Bento Grid */}
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Chất liệu cốt lõi</span>
                <span className="font-bold text-black uppercase">
                  Gỗ Sồi &amp; PLA hữu cơ
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Chế tác thủ công</span>
                <span className="font-bold text-[#FF9D00] uppercase">
                  Mài tay 48 Giờ
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Cấu trúc in chịu lực</span>
                <span className="font-bold text-[#FF9D00] uppercase">
                  Gyroid Infill 45%
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Bảo mật dữ liệu</span>
                <span className="font-bold text-black uppercase">
                  Supabase RLS Enabled
                </span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-[#786F66]">Đơn vị vận hành</span>
                <span className="font-bold text-black uppercase">
                  Boo Space Studio ©2026
                </span>
              </div>
            </div>

            {/* Các chứng nhận tiêu chuẩn vi mô */}
            <div className="pt-6 border-t border-[#E1DDD5]/60 space-y-3.5 text-xs text-[#5C564E]">
              <div className="flex gap-3">
                <Layers className="size-4 text-[#FF9D00] shrink-0" />
                <p className="leading-tight">
                  <strong>Độc bản:</strong> Không sản xuất công nghiệp hàng
                  loạt. Mỗi thớ gỗ sồi là một hoa văn vân độc nhất vô nhị.
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="size-4 text-[#FF9D00] shrink-0" />
                <p className="leading-tight">
                  <strong>Lành tính:</strong> Nhựa sinh học phân hủy hữu cơ
                  không mùi, an toàn khi chạm và ngửi hằng ngày.
                </p>
              </div>
              <div className="flex gap-3">
                <Heart className="size-4 text-[#FF9D00] shrink-0" />
                <p className="leading-tight">
                  <strong>Cá nhân hóa:</strong> Sẵn sàng lắng nghe và chế tác
                  riêng theo các bản vẽ phác thảo do chính bạn gửi tới.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black rounded-xl font-mono uppercase text-[10px] font-bold tracking-wider py-4 cursor-pointer"
              >
                <Link href="/shop">Khám phá sản phẩm</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
