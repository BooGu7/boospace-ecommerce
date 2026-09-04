import type { Metadata } from "next";
import { Lock, ShieldCheck, UserCheck } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Chính sách bảo mật thông tin — Boo Space",
  description:
    "Cam kết bảo mật dữ liệu khách hàng tuyệt đối, minh bạch mục đích thu thập và bảo vệ quyền riêng tư tại Boo Space.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FCFAF2] min-h-screen text-[#1E1C1A] antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E1DDD5] pb-8 text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC]">
            <Lock className="size-3.5 text-[#3ECF8E]" /> DATA PRIVACY &amp; SECURITY
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">
            Chính sách bảo mật thông tin
          </h1>
          <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider">
            Cam kết bảo vệ quyền riêng tư &amp; dữ liệu khách hàng tại Boo Space
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-10 text-left font-sans text-sm sm:text-base leading-relaxed text-[#5C564E]">
          <p className="italic text-black font-serif text-base border-l-2 border-[#FF9D00] pl-4 py-1">
            &quot;Boo Space hiểu rằng thông tin cá nhân là sự tin tưởng mà bạn gửi gắm. Chúng tôi trân trọng và cam kết bảo vệ dữ liệu của bạn bằng sự minh bạch, an toàn và tinh thần trách nhiệm cao nhất.&quot;
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              1. Các loại dữ liệu thu thập &amp; Mục đích sử dụng
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Thông tin cần thiết khi đặt hàng:</strong> Họ tên, số điện thoại, địa chỉ nhận hàng, địa chỉ email và ghi chú giao hàng.
              </li>
              <li>
                <strong>Mục đích sử dụng duy nhất:</strong> Xử lý đóng gói và giao hàng đến tận tay bạn, thông báo tình trạng đơn hàng, hỗ trợ giải đáp thắc mắc và thực hiện chính sách bảo hành, đổi trả sau mua.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#3ECF8E]" /> 2. Nguyên tắc đồng thuận &amp; Quyền riêng tư
            </h2>
            <p>
              Việc thu thập thông tin chỉ diễn ra khi bạn chủ động điền và xác nhận đặt đơn hàng tại trang thanh toán. Boo Space cam kết:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Không mua bán hay chia sẻ:</strong> Tuyệt đối không chia sẻ, bán hoặc trao đổi thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo thương mại.
              </li>
              <li>
                <strong>Chỉ chuyển giao thông tin giao vận:</strong> Chỉ cung cấp tên, số điện thoại và địa chỉ cho nhân viên bưu tá để hoàn tất giao kiện hàng đến bạn.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <UserCheck className="size-5 text-[#FF9D00]" /> 3. Lưu trữ an toàn &amp; Quyền lợi của bạn
            </h2>
            <p>
              Toàn bộ dữ liệu của bạn được lưu trữ trên hạ tầng bảo mật an toàn, bảo vệ chống truy cập trái phép.
            </p>
            <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-2 text-xs">
              <p className="font-bold text-black text-sm">Bạn luôn có toàn quyền kiểm soát thông tin cá nhân:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#5C564E]">
                <li>Yêu cầu kiểm tra, cập nhật hoặc sửa đổi thông tin nhận hàng bất kỳ lúc nào.</li>
                <li>Yêu cầu xóa toàn bộ lịch sử thông tin liên hệ khỏi hệ thống Boo Space.</li>
                <li>
                  Mọi yêu cầu xin gửi về hòm thư hỗ trợ chính thức:{" "}
                  <strong className="text-black font-mono">{siteConfig.contact.email}</strong> (xử lý và phản hồi trong vòng 24 giờ).
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
