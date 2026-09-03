import type { Metadata } from "next";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Chính sách đổi trả & hoàn tiền",
  description:
    "Quy trình đổi trả 4 bước minh bạch, điều kiện hoàn tiền và chính sách bảo hành sản phẩm chế tác thủ công tinh xảo tại Boo Space.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#FCFAF2] min-h-screen text-[#1E1C1A] antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E1DDD5] pb-8 text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC]">
            <RotateCcw className="size-3.5 text-[#FF9D00]" /> REFUND &amp;
            RETURN POLICY
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">
            Chính sách đổi trả &amp; hoàn tiền
          </h1>
          <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider">
            Tuân thủ Luật Thương mại 2005 &amp; Tiêu chuẩn bảo vệ người tiêu
            dùng 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-10 text-left font-sans text-sm sm:text-base leading-relaxed text-[#5C564E]">
          <p className="italic text-black font-serif text-base border-l-2 border-[#FF9D00] pl-4 py-1">
            &quot;Tại Boo Space, chúng tôi cam kết bảo vệ tuyệt đối quyền lợi
            của bạn bằng việc cung cấp một chính sách đổi trả minh bạch và nhất
            quán. Đây là lớp bảo hiểm đáng tin cậy giúp bạn hoàn toàn an tâm khi
            sở hữu những thiết kế độc bản.&quot;
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              1. Thời hạn &amp; Trường hợp áp dụng đổi trả
            </h2>

            <div className="space-y-4">
              <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-2">
                <h3 className="font-serif font-bold text-black text-base flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#3ECF8E]" /> Trường hợp
                  1: Lỗi từ phía Boo Space hoặc do vận chuyển
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C564E]">
                  <li>
                    <strong>Thời hạn:</strong> Trong vòng{" "}
                    <strong>07 ngày</strong> kể từ khi đơn hàng giao thành công.
                  </li>
                  <li>
                    <strong>Lỗi chấp nhận:</strong> Sản phẩm bị vỡ hỏng do vận
                    chuyển, giao sai mẫu/màu, hoặc khuyết điểm từ khâu hoàn thiện thủ công.
                  </li>
                  <li>
                    <strong>Chi phí:</strong> Boo Space chịu{" "}
                    <strong>100% phí vận chuyển hai chiều</strong>.
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-2">
                <h3 className="font-serif font-bold text-black text-base flex items-center gap-2">
                  <RotateCcw className="size-4 text-[#FF9D00]" /> Trường hợp 2:
                  Đổi size hoặc đổi màu do chọn nhầm
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C564E]">
                  <li>
                    <strong>Thời hạn:</strong> Trong vòng{" "}
                    <strong>03 ngày</strong> kể từ khi nhận hàng.
                  </li>
                  <li>
                    <strong>Điều kiện:</strong> Sản phẩm còn mới 100%, chưa qua
                    sử dụng, còn nguyên nhãn mác và vỏ hộp.
                  </li>
                  <li>
                    <strong>Chi phí:</strong> Khách hàng chịu{" "}
                    <strong>100% phí vận chuyển hai chiều</strong>.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <AlertCircle className="size-5 text-red-500" /> 2. Các trường hợp
              không hỗ trợ đổi trả
            </h2>
            <div className="p-5 bg-red-50/40 border border-red-200/80 rounded-2xl space-y-2 text-xs text-red-950">
              <p className="font-bold">
                Boo Space không hỗ trợ đổi trả đối với:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Sản phẩm thiết kế theo yêu cầu riêng:</strong> Các sản
                  phẩm khắc tên riêng, tinh chỉnh kích thước riêng hoặc chế tác
                  theo bản phác thảo do khách hàng cung cấp.
                </li>
                <li>
                  Sản phẩm bị biến dạng do bảo quản sai cách (như để trong cabin
                  ô tô phơi nắng gắt mùa hè hoặc dùng các dung môi hóa chất mạnh như Acetone,
                  xăng thơm để lau chùi).
                </li>
                <li>
                  Gửi yêu cầu quá thời hạn quy định hoặc không cung cấp được
                  video clip mở hộp (unboxing).
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              3. Quy trình thực hiện đổi trả 4 bước
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
              <div className="p-4 bg-white border border-[#E1DDD5] rounded-2xl space-y-1">
                <span className="font-mono font-bold text-[#FF9D00]">
                  BƯỚC 01 / GỬI YÊU CẦU
                </span>
                <p className="text-black font-semibold">
                  Nhắn tin Zalo/Email đính kèm clip unboxing mở hộp.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#E1DDD5] rounded-2xl space-y-1">
                <span className="font-mono font-bold text-[#FF9D00]">
                  BƯỚC 02 / THẨM ĐỊNH
                </span>
                <p className="text-black font-semibold">
                  Boo Space xác minh hồ sơ trong 24 – 48 giờ làm việc.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#E1DDD5] rounded-2xl space-y-1">
                <span className="font-mono font-bold text-[#FF9D00]">
                  BƯỚC 03 / GỬI HÀNG HOÀN
                </span>
                <p className="text-black font-semibold">
                  Khách đóng gói cẩn thận gửi về địa chỉ kho xưởng.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#E1DDD5] rounded-2xl space-y-1">
                <span className="font-mono font-bold text-[#FF9D00]">
                  BƯỚC 04 / ĐỔI HÀNG / HOÀN TIỀN
                </span>
                <p className="text-black font-semibold">
                  Xưởng gửi sản phẩm mới hoặc hoàn tiền ngay.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              4. Chính sách hoàn tiền
            </h2>
            <p>
              Boo Space hoàn tiền thông qua hình thức{" "}
              <strong>chuyển khoản ngân hàng trực tiếp / VietQR</strong> về đúng
              tài khoản chính chủ mua hàng.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li>
                Lệnh hoàn tiền được duyệt trong 01–03 ngày làm việc sau khi kho
                nhận lại hàng.
              </li>
              <li>
                Tiền sẽ ghi có vào tài khoản khách hàng từ 03–07 ngày làm việc
                tùy ngân hàng.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
