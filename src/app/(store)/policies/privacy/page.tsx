import type { Metadata } from "next";
import { Database, Lock, ShieldCheck } from "lucide-react";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Chính sách bảo mật thông tin",
  description:
    "Cam kết bảo vệ dữ liệu cá nhân theo Luật Bảo vệ dữ liệu số 91/2025/QH15 & Nghị định 356/2025/NĐ-CP tại Boo Space.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FCFAF2] min-h-screen text-[#1E1C1A] antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E1DDD5] pb-8 text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC]">
            <Lock className="size-3.5 text-[#3ECF8E]" /> DATA PRIVACY &amp;
            SECURITY
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">
            Chính sách bảo mật thông tin
          </h1>
          <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider">
            Tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 &amp; Nghị định
            356/2025/NĐ-CP
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-10 text-left font-sans text-sm sm:text-base leading-relaxed text-[#5C564E]">
          <p className="italic text-black font-serif text-base border-l-2 border-[#FF9D00] pl-4 py-1">
            &quot;Boo Space hiểu rằng thông tin cá nhân là tài sản riêng tư và
            nhạy cảm nhất của bạn. Chúng tôi cam kết bảo vệ dữ liệu cá nhân bằng
            việc tuân thủ tuyệt đối các tiêu chuẩn an toàn thông tin hiện
            đại.&quot;
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              1. Các loại dữ liệu thu thập &amp; Mục đích sử dụng
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Thông tin thu thập:</strong> Họ tên, số điện thoại, địa
                chỉ email, địa chỉ giao nhận hàng và ghi chú đơn hàng.
              </li>
              <li>
                <strong>Mục đích:</strong> Xử lý đơn hàng qua đơn vị GHN/Viettel
                Post, khởi tạo mã VietQR động, hỗ trợ bảo hành sản phẩm
                và đối soát thuế điện tử.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#3ECF8E]" /> 2. Nguyên tắc sự
              đồng ý của chủ thể dữ liệu
            </h2>
            <p>
              Việc thu thập dữ liệu chỉ tiến hành khi bạn chủ động xác nhận tại
              trang Checkout. Theo đúng quy định 2026,{" "}
              <strong>
                sự im lặng hoặc không phản hồi hoàn toàn không được coi là sự
                đồng ý
              </strong>
              .
            </p>
            <p className="text-xs italic text-[#786F66]">
              *Bạn có quyền rút lại sự đồng ý bất kỳ lúc nào. Boo Space sẽ xử lý
              yêu cầu dừng lưu trữ trong vòng 24 giờ.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <Database className="size-5 text-[#FF9D00]" /> 3. Lưu trữ dữ liệu
              trong nước
            </h2>
            <p>
              Toàn bộ dữ liệu người dùng tại Việt Nam được lưu trữ an toàn trong
              nước thông qua hệ thống cơ sở dữ liệu PostgreSQL bảo mật cao
              (triển khai trên Supabase đặt tại trung tâm dữ liệu Việt Nam)
              trong thời hạn tối thiểu <strong>24 tháng</strong> theo Nghị định
              53.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              4. Biện pháp bảo mật &amp; Quyền người dùng
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Mã hóa dữ liệu truyền tải chuẩn SSL/TLS và cài đặt MFA cho hệ
                thống Admin.
              </li>
              <li>
                Bạn có quyền gửi yêu cầu xóa sạch dữ liệu cá nhân qua email{" "}
                <strong>support@boospace.tech</strong> (xử lý trong 03 ngày làm
                việc).
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
