import type { Metadata } from "next";
import { FileText, Shield, Sparkles } from "lucide-react";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Điều khoản sử dụng dịch vụ — Boo Space",
  description:
    "Quy định giao dịch, thanh toán VietQR, quy trình đặt thiết kế riêng và hướng dẫn bảo quản sản phẩm tại Boo Space.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FCFAF2] min-h-screen text-[#1E1C1A] antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E1DDD5] pb-8 text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC]">
            <FileText className="size-3.5 text-[#FF9D00]" /> TERMS OF SERVICE
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">
            Điều khoản sử dụng dịch vụ
          </h1>
          <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider">
            Thỏa thuận pháp lý giữa Khách hàng và Boo Space
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-10 text-left font-sans text-sm sm:text-base leading-relaxed text-[#5C564E]">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              1. Nguyên tắc giao dịch &amp; Phương thức thanh toán
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Quét mã QR Ngân hàng (Tự động):</strong> Hệ thống tạo mã
                QR động chứa đúng số tiền và cú pháp đơn hàng, tự động xác nhận
                thanh toán thành công tức thì trong vài giây.
              </li>
              <li>
                <strong>Thanh toán khi nhận hàng (COD):</strong> Áp dụng cho các
                đơn hàng tiêu chuẩn trên toàn quốc qua đối tác giao hàng uy tín.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <Sparkles className="size-5 text-[#FF9D00]" /> 2. Quy trình thiết kế &amp; Chế tác riêng (Custom Design)
            </h2>
            <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-3 text-xs">
              <p>
                <strong>Báo giá minh bạch:</strong> Chi phí chế tác được tính toán rõ ràng dựa trên kích thước, độ phức tạp của hình khối và thời gian hoàn thiện thủ công của từng tác phẩm.
              </p>
              <p>
                Đơn hàng chế tác riêng sẽ được đưa vào lịch hoàn thiện ngay sau khi hai bên thống nhất phương án thiết kế và nhận chuyển khoản đặt cọc.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <Shield className="size-5 text-[#3ECF8E]" /> 3. Cam kết chất liệu &amp; Hướng dẫn bảo quản
            </h2>
            <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-950">
              <p className="font-bold text-sm text-black">
                Lưu ý quan trọng khi sử dụng sản phẩm:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Tránh nhiệt độ quá cao:</strong> Tránh để sản phẩm trong cabin ô tô đóng kín cửa đỗ lâu dưới trời nắng gắt ngoài trời.
                </li>
                <li>
                  <strong>Vệ sinh đúng cách:</strong> Rửa sạch bằng nước ấm hoặc khăn mềm ẩm. Tránh dùng các dung môi tẩy rửa mạnh như Acetone, cồn nồng độ cao hoặc xăng thơm để lau chùi.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
