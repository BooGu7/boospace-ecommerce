import type { Metadata } from "next";
import { Cpu, FileText, Shield } from "lucide-react";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Điều khoản sử dụng dịch vụ",
  description:
    "Quy định giao dịch, thanh toán VietQR, quy trình đặt in 3D Custom và lưu ý bảo quản chất liệu CR-PETG tại Boo Space.",
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
                <strong>Thanh toán VietQR tự động:</strong> Khởi tạo mã QR động
                chứa đúng cú pháp đơn hàng `#BSxxx`, tự động khớp lệnh gạch nợ
                thành công trong vài giây.
              </li>
              <li>
                <strong>Thanh toán COD:</strong> Áp dụng cho các đơn hàng tiêu
                chuẩn trên toàn quốc qua GHN và J&amp;T Express.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <Cpu className="size-5 text-[#FF9D00]" /> 2. Quy trình đặt in
              Custom (Custom Design)
            </h2>
            <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-3 text-xs">
              <p>
                <strong>Thuật toán COGS Slicer Engine:</strong> Giá chế tác được
                tính dựa trên{" "}
                <strong className="text-black">
                  trọng lượng nhựa CR-PETG thực tế (120đ/g)
                </strong>{" "}
                kết hợp tổng số giờ in khấu hao máy.
              </p>
              <p>
                Đơn hàng Custom chỉ chính thức đưa vào hàng chờ in (Slicer
                Queue) sau khi chuyển khoản cọc 100% giá trị báo giá.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <Shield className="size-5 text-[#3ECF8E]" /> 3. Cam kết chất liệu
              &amp; Lưu ý bảo quản CR-PETG
            </h2>
            <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-950">
              <p className="font-bold text-sm text-black">
                Lưu ý quan trọng khi sử dụng sản phẩm CR-PETG:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Tránh nhiệt độ cực đoan:</strong> Tuyệt đối không để
                  sản phẩm trong cabin ô tô đóng kín cửa đỗ lâu dưới nắng gắt
                  (nơi nhiệt độ vượt quá 80°C gây biến dạng nhựa).
                </li>
                <li>
                  <strong>Vệ sinh đúng cách:</strong> Rửa sạch bằng nước ấm hoặc
                  khăn mềm. Tuyệt đối không dùng dung môi mạnh như Acetone, xăng
                  thơm để lau chùi.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
