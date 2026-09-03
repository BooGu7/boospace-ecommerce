import type { Metadata } from "next";
import Link from "next/link";
import { Award, Cpu, Heart, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Về Boo Space — Studio Chế tác Workspace Độc Bản",
  description:
    "Boo Space kiến tạo những điểm tựa tĩnh lặng hằng ngày thông qua các thiết kế đèn ambient khúc xạ, chậu cây tự tưới và phụ kiện workspace tinh tế mộc mạc.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* ==========================================
           HEADER SECTION: TIÊU ĐỀ & SUBTITLE CHUẨN
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
            <p className="text-base sm:text-xl font-serif italic text-[#786F66] font-medium pt-1">
              &quot;Không gian của những kẻ mơ mộng thực tế.&quot;
            </p>
          </div>
        </div>

        {/* ==========================================
           TUYÊN NGÔN BOLD QUOTE
           ========================================== */}
        <div className="max-w-4xl border-b border-[#E1DDD5]/60 pb-12 mb-16 text-left">
          <p className="font-serif text-2xl sm:text-3xl font-light text-black leading-relaxed italic">
            &quot;Tại Boo Space, chúng tôi không chỉ chế tác các vật phẩm decor.
            Chúng tôi kiến tạo những điểm tựa tĩnh lặng hằng ngày.&quot;
          </p>
        </div>

        {/* ==========================================
           BỐ CỤC NỘI DUNG 2 CỘT TACTILE GRID
           ========================================== */}
        <div className="grid gap-16 lg:grid-cols-12 items-start">
          {/* CỘT TRÁI (KỂ CHUYỆN & TRIẾT LÝ VĂN BẢN MỚI) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            {/* Mục 1: Khởi nguồn */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight border-b border-[#E1DDD5]/60 pb-2">
                1. KHỞI NGUỒN: TIẾNG ỒN CỦA KỶ NGUYÊN SỐ
              </h3>
              <p className="text-sm leading-relaxed text-[#5C564E] font-sans">
                Chúng ta đang sống trong một thời đại mà sự xao nhãng đã trở
                thành một thứ &quot;bệnh dịch&quot; âm thầm hằng ngày. Mớ dây
                cáp lộn xộn trên mặt bàn, những thông báo đẩy liên tục từ màn
                hình thiết bị, và ánh sáng chói gắt từ hệ thống đèn LED trực
                diện... Tất cả đang âm thầm vắt kiệt năng lượng và cướp đi khả
                năng tư duy sâu (Deep Focus) của những người làm việc trí óc.
              </p>
              <p className="text-sm leading-relaxed text-[#5C564E] font-sans">
                Boo Space ra đời từ một câu hỏi giản đơn:{" "}
                <em className="text-black font-serif">
                  Làm thế nào để thiết lập lại ranh giới của sự tập trung ngay
                  tại góc phòng của bạn?
                </em>
              </p>
              <p className="text-sm leading-relaxed text-black font-sans font-semibold bg-[#FAF5F2] p-4 rounded-2xl border border-[#E1DDD5]">
                Chúng tôi tin rằng,{" "}
                <strong>
                  sức mạnh của tư duy bắt đầu từ sự ngăn nắp trực giác
                </strong>
                . Bản chất của một không gian làm việc hay sinh hoạt hiệu quả
                không phải là nhồi nhét thật nhiều thiết bị, mà là loại bỏ những
                xao nhãng không cần thiết để nhường chỗ cho dòng chảy của sự
                sáng tạo thuần khiết.
              </p>
            </div>

            {/* Mục 2: Triết lý chế tác */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight border-b border-[#E1DDD5]/60 pb-2">
                2. TRIẾT LÝ CHẾ TÁC: KHI NGHỆ THUẬT GẶP GỠ CÔNG NĂNG THỰC TẾ
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                Boo Space tự định vị mình là nơi gặp gỡ của hai thái cực:{" "}
                <strong className="text-black">
                  Sự bay bổng trong thiết kế và tính thực tế trong đời sống hằng
                  ngày
                </strong>
                . Mỗi sản phẩm tại Boo Space được phát triển dựa trên ba giá trị
                cốt lõi:
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-1.5 shadow-xs">
                  <h4 className="font-serif font-bold text-black text-base flex items-center gap-2">
                    <Sparkles className="size-4 text-[#FF9D00]" /> Ánh sáng khúc
                    xạ (Ambient Lights)
                  </h4>
                  <p className="text-xs text-[#5C564E] leading-relaxed">
                    Không sử dụng nguồn sáng trực tiếp gây mỏi mắt. Các thiết kế
                    đèn của chúng tôi ứng dụng cấu trúc hình học nguyên khối để
                    khúc xạ nguồn sáng thô thành những vệt sáng ambient êm dịu,
                    xoa dịu thị giác lúc nửa đêm.
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-1.5 shadow-xs">
                  <h4 className="font-serif font-bold text-black text-base flex items-center gap-2">
                    <Award className="size-4 text-[#3ECF8E]" /> Mảng xanh thông
                    minh (Smart Planters)
                  </h4>
                  <p className="text-xs text-[#5C564E] leading-relaxed">
                    Mang thiên nhiên vào bàn làm việc một cách tinh gọn. Hệ
                    thống chậu cây tự tưới tích hợp rãnh thoát nước ẩn ngầm
                    thông minh, giữ cho mầm sống tự sinh trưởng mà không lo tràn
                    nước ra bàn làm việc.
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-1.5 shadow-xs">
                  <h4 className="font-serif font-bold text-black text-base flex items-center gap-2">
                    <Sparkles className="size-4 text-[#FF9D00]" /> Bề mặt nhám mộc
                    (Matte Ceramic Feel)
                  </h4>
                  <p className="text-xs text-[#5C564E] leading-relaxed">
                    Chúng tôi từ bỏ các chất liệu công nghiệp bóng bẩy. Toàn bộ sản
                    phẩm được chế tác từ chất liệu cao cấp bền nhẹ —
                    chịu lực tốt, kháng nước tự nhiên và chống ẩm mốc bền bỉ.
                    Từng đường nét được chăm chút tỉ mỉ để lưu giữ vân nhám mịn mộc mạc,
                    mang lại cảm giác chạm ấm áp như gốm nung.
                  </p>
                </div>
              </div>
            </div>

            {/* Mục 3: Ba phân khu không gian */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight border-b border-[#E1DDD5]/60 pb-2">
                3. BA PHÂN KHU KHÔNG GIAN (THE PORTFOLIO)
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                Chúng tôi tập trung sâu vào 3 ngách sản phẩm được quy hoạch mạch
                lạc, đồng hành cùng trải nghiệm sống hằng ngày của bạn:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                <div className="p-4 bg-[#FAF5F2] border border-[#E1DDD5] rounded-2xl space-y-1.5">
                  <span className="font-mono font-bold text-[#FF9D00] text-[10px] uppercase">
                    01 / HOME DECOR
                  </span>
                  <h5 className="font-serif font-bold text-black text-sm">
                    Decor Không Gian Sống
                  </h5>
                  <p className="text-[#5C564E] leading-relaxed">
                    Vật dụng thông minh, tinh gọn cho bếp, phòng khách &amp; góc
                    làm việc.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF5F2] border border-[#E1DDD5] rounded-2xl space-y-1.5">
                  <span className="font-mono font-bold text-[#FF9D00] text-[10px] uppercase">
                    02 / ART TOYS
                  </span>
                  <h5 className="font-serif font-bold text-black text-sm">
                    Đồ Chơi Nghệ Thuật
                  </h5>
                  <p className="text-[#5C564E] leading-relaxed">
                    Hình khối tối giản, đánh thức đứa trẻ mơ mộng bên trong bạn.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF5F2] border border-[#E1DDD5] rounded-2xl space-y-1.5">
                  <span className="font-mono font-bold text-[#FF9D00] text-[10px] uppercase">
                    03 / WORKSPACE
                  </span>
                  <h5 className="font-serif font-bold text-black text-sm">
                    Workspace Custom
                  </h5>
                  <p className="text-[#5C564E] leading-relaxed">
                    Khay dọn dây cáp, kệ đỡ bàn làm việc chuyên biệt cho tập
                    trung sâu.
                  </p>
                </div>
              </div>
            </div>

            {/* Mục 4: Cam kết */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight border-b border-[#E1DDD5]/60 pb-2">
                4. CAM KẾT CỦA BOO SPACE
              </h3>
              <p className="text-sm text-[#5C564E] leading-relaxed">
                Chúng tôi vận hành theo mô hình{" "}
                <strong className="text-black">
                  Chế tác tinh gọn (Made to Order)
                </strong>
                . Điều này đồng nghĩa với việc không có sản phẩm nào bị sản xuất
                đại trà hay lưu kho lãng phí. Mỗi chiếc đèn, mỗi chậu cây chỉ
                thực sự được kiến tạo tỉ mỉ khi nhận được
                sự đồng điệu và đơn đặt hàng từ bạn.
              </p>
              <div className="p-6 bg-black text-white rounded-3xl space-y-2 text-center shadow-lg">
                <span className="text-[10px] font-mono text-[#FF9D00] uppercase tracking-widest font-bold">
                  S L O G A N
                </span>
                <p className="font-serif text-xl sm:text-2xl italic font-bold text-[#FCFAF2]">
                  &quot;Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay hôm
                  nay.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (CHỈ SỐ BẢNG TIÊU CHUẨN HOÀN THIỆN) */}
          <div className="lg:col-span-5 space-y-8 bg-[#FAF5F2]/80 border border-[#E1DDD5] rounded-3xl p-8 shadow-xs text-left">
            <div className="space-y-2 pb-4 border-b border-[#E1DDD5]/60">
              <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-semibold">
                03 / SPECIFICATIONS
              </span>
              <h3 className="font-serif text-xl font-bold text-black">
                Tiêu chuẩn chế tác mộc
              </h3>
            </div>

            {/* Bảng tiêu chuẩn hoàn thiện */}
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Cốt lõi chất liệu</span>
                <span className="font-bold text-black uppercase">
                  Chất liệu cao cấp &amp; an toàn
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Khả năng thích ứng</span>
                <span className="font-bold text-[#FF9D00] uppercase">
                  Bền bỉ, kháng ẩm tự nhiên
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Mô hình chế tác</span>
                <span className="font-bold text-black uppercase">
                  Độc bản (Made to Order)
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E1DDD5]/40 pb-2.5">
                <span className="text-[#786F66]">Bề mặt hoàn thiện</span>
                <span className="font-bold text-black uppercase">
                  Vân nhám mịn gốm mộc
                </span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-[#786F66]">Đơn vị vận hành</span>
                <span className="font-bold text-black uppercase">
                  Boo Space Studio ©2026
                </span>
              </div>
            </div>

            {/* Chứng nhận tiêu chuẩn */}
            <div className="pt-6 border-t border-[#E1DDD5]/60 space-y-3.5 text-xs text-[#5C564E]">
              <div className="flex gap-3">
                <Layers className="size-4 text-[#FF9D00] shrink-0" />
                <p className="leading-tight">
                  <strong>Kháng nước tự nhiên:</strong> Không ẩm mốc, dễ dàng
                  rửa sạch bằng nước ấm hằng ngày.
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="size-4 text-[#FF9D00] shrink-0" />
                <p className="leading-tight">
                  <strong>An toàn không gian sống:</strong> Chất liệu an toàn, hoàn toàn
                  không mùi độc hại, an tâm trong phòng kín.
                </p>
              </div>
              <div className="flex gap-3">
                <Heart className="size-4 text-[#FF9D00] shrink-0" />
                <p className="leading-tight">
                  <strong>Cá nhân hóa:</strong> Sẵn sàng lắng nghe và chế tác
                  riêng theo các bản vẽ phác thảo của bạn.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black rounded-xl font-mono uppercase text-xs font-bold tracking-wider py-4 cursor-pointer shadow-sm"
              >
                <Link href="/shop">Khám phá sản phẩm ngay →</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
