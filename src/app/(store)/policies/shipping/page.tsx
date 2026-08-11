import type { Metadata } from "next";
import { Clock, ShieldCheck, Truck } from "lucide-react";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Chính sách vận chuyển & giao nhận",
  description:
    "Thông tin chi tiết về đối tác vận chuyển GHN, J&T Express, thời gian giao hàng, biểu phí và chính sách đồng kiểm của Boo Space.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FCFAF2] min-h-screen text-[#1E1C1A] antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E1DDD5] pb-8 text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC]">
            <Truck className="size-3.5 text-[#3ECF8E]" /> LOGISTICS &amp;
            DELIVERY POLICY
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black">
            Chính sách vận chuyển &amp; giao nhận
          </h1>
          <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider">
            Cập nhật tuân thủ Nghị định số 248/2026/NĐ-CP
          </p>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-10 text-left font-sans text-sm sm:text-base leading-relaxed text-[#5C564E]">
          <p className="italic text-black font-serif text-base border-l-2 border-[#FF9D00] pl-4 py-1">
            &quot;Chào mừng bạn đến với Boo Space — Không gian của những kẻ mơ
            mộng thực tế. Chúng tôi tin rằng hành trình đưa một sản phẩm tối
            giản đến góc làm việc của bạn cần được vận hành với sự minh bạch và
            chỉn chu tuyệt đối.&quot;
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              1. Phương thức giao hàng &amp; Đơn vị vận chuyển
            </h2>
            <p>
              Để đảm bảo các sản phẩm được bảo quản hoàn hảo trong suốt lộ trình
              vận chuyển, Boo Space hợp tác với các đơn vị dịch vụ logistics
              chuyên nghiệp và hợp pháp tại Việt Nam:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Đơn vị vận chuyển liên kết chính thức:</strong> Giao
                Hàng Nhanh (GHN) và J&amp;T Express.
              </li>
              <li>
                <strong>Phương thức giao hàng tiêu chuẩn:</strong> Sản phẩm sau
                khi hoàn thiện xử lý nguội thủ công sẽ được đóng gói chống sốc
                và bàn giao cho đơn vị vận chuyển.
              </li>
              <li>
                <strong>
                  Phương thức nhận tại xưởng (Click &amp; Collect):
                </strong>{" "}
                Khách hàng có thể hẹn lịch trước qua Zalo để nhận sản phẩm trực
                tiếp tại Workshop của Boo Space.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <Clock className="size-5 text-[#FF9D00]" /> 2. Thời hạn ước tính
              giao hàng
            </h2>
            <p>
              Thời gian giao hàng được tính kể từ khi Boo Space xác nhận đơn
              hàng thanh toán thành công (hoặc xác nhận đơn COD hợp lệ):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-1">
                <span className="text-xs font-mono font-bold text-[#FF9D00] uppercase">
                  Nội thành TP.HCM
                </span>
                <p className="font-serif font-bold text-black text-lg">
                  01 – 03 ngày làm việc
                </p>
              </div>
              <div className="p-5 bg-white border border-[#E1DDD5] rounded-2xl space-y-1">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Tỉnh thành khác
                </span>
                <p className="font-serif font-bold text-black text-lg">
                  03 – 07 ngày làm việc
                </p>
              </div>
            </div>
            <p className="text-xs italic text-[#786F66]">
              *Lưu ý: Không tính ngày Chủ nhật và các ngày lễ Tết theo quy định
              pháp luật. Trong trường hợp phát sinh chậm trễ do sự cố bất khả
              kháng, Boo Space sẽ chủ động thông báo kịp thời cho khách hàng.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              3. Biểu phí vận chuyển &amp; Giới hạn địa lý
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Giới hạn địa lý:</strong> Boo Space hỗ trợ giao hàng
                trên phạm vi toàn lãnh thổ Việt Nam.
              </li>
              <li>
                <strong>Chính sách miễn phí vận chuyển:</strong> Boo Space áp
                dụng chính sách{" "}
                <strong className="text-[#3ECF8E]">
                  MIỄN PHÍ VẬN CHUYỂN (Free Shipping)
                </strong>{" "}
                duy nhất cho các đơn hàng giao tại khu vực nội thành TP. Hồ Chí
                Minh.
              </li>
              <li>
                <strong>Khu vực ngoại thành và tỉnh lẻ:</strong> Cước phí vận
                chuyển được tính toán tự động dựa trên khoảng cách địa lý và
                kích thước kiện hàng theo biểu phí niêm yết của đơn vị logistics
                tại thời điểm checkout (cố định 30.000đ).
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
              4. Trách nhiệm của đơn vị Logistics trong việc cung cấp thông tin
            </h2>
            <p>
              Đơn vị dịch vụ vận chuyển (GHN / J&amp;T Express) có trách nhiệm
              cập nhật liên tục trạng thái hành trình của đơn hàng lên hệ thống
              để Boo Space và khách hàng có thể đồng thời tra cứu thời gian thực
              (Real-time Tracking):
            </p>
            <ol className="list-decimal pl-6 space-y-1.5 font-mono text-xs">
              <li>Đã tiếp nhận hàng từ xưởng Boo Space.</li>
              <li>Đang trong quá trình trung chuyển/vận chuyển liên tỉnh.</li>
              <li>Đã đến bưu cục phát và đang giao hàng.</li>
              <li>Giao hàng thành công (hoặc báo hủy kèm lý do cụ thể).</li>
            </ol>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-black border-b border-[#E1DDD5]/60 pb-2 flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#3ECF8E]" /> 5. Chính sách
              kiểm hàng (Đồng kiểm)
            </h2>
            <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl space-y-2">
              <p className="font-bold text-black text-sm">
                Khuyến khích đồng kiểm cùng Shipper:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-950">
                <li>
                  <strong>Phạm vi kiểm tra:</strong> Khách hàng được quyền mở
                  hộp để kiểm tra ngoại quan sản phẩm (đúng mẫu mã, số lượng,
                  màu sắc; sản phẩm nguyên vẹn không bị nứt vỡ do va đập).
                </li>
                <li>
                  <strong>Giới hạn:</strong> Không bao gồm dùng thử, vận hành
                  thử hoặc làm biến dạng cấu trúc sản phẩm.
                </li>
                <li>
                  <strong>Xử lý sự cố:</strong> Nếu thấy hư hỏng do vận chuyển,
                  vui lòng từ chối nhận, lập biên bản với shipper và liên hệ
                  ngay hotline Boo Space để được gửi sản phẩm thay thế.
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Footer Box */}
          <div className="mt-12 p-6 bg-white border border-[#E1DDD5] rounded-3xl space-y-2 text-xs font-mono text-left">
            <h4 className="font-serif text-sm font-bold text-black uppercase">
              Thông tin hỗ trợ vận chuyển
            </h4>
            <p>
              Hotline hỗ trợ:{" "}
              <strong className="text-[#FF9D00]">0913.449.968</strong>
            </p>
            <p>
              Email tiếp nhận xử lý:{" "}
              <strong className="text-black">legal@boospace.tech</strong>
            </p>
            <p>Khung giờ hỗ trợ: 08:00 – 18:00 (Thứ Hai – Thứ Bảy)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
