import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Headphones, Mail, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/config";

export const revalidate = 86400; // Cache 24 giờ

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp — Boo Space FAQ",
  description:
    "Giải đáp chi tiết về chất liệu sản phẩm, quy trình đặt thiết kế riêng, phí vận chuyển và chính sách chăm sóc khách hàng tại Boo Space ✨",
};

const faqSections = [
  {
    id: "product-materials",
    title: "I. SẢN PHẨM & CHẤT LIỆU",
    items: [
      {
        q: "01. Sản phẩm của Boo Space được chế tác từ chất liệu gì?",
        a: "Toàn bộ sản phẩm Decor và phụ kiện Workspace của Boo Space được chế tác từ chất liệu cao cấp bền nhẹ, sở hữu bề mặt lì mộc mạc như gốm nung.\n\nKhác với các vật liệu thông thường dễ nứt vỡ hay biến dạng, chất liệu tuyển chọn của Boo Space có độ bền cao, kháng nước và chống ẩm mốc tự nhiên. Đặc biệt, bề mặt được tinh chỉnh thủ công để lưu giữ xúc giác nhám mịn ấm áp, tôn lên vẻ đẹp tối giản cho căn phòng.",
      },
      {
        q: "02. Chất liệu có an toàn cho không gian sống không?",
        a: "Tuyệt đối an toàn. Chất liệu do Boo Space tuyển chọn hoàn toàn không mùi, không giải phóng hóa chất độc hại trong suốt quá trình sử dụng. Bạn hoàn toàn có thể yên tâm bài trí trong phòng ngủ, góc làm việc kín hay môi trường gia đình có trẻ nhỏ.",
      },
      {
        q: "03. Làm thế nào để vệ sinh và gìn giữ vẻ đẹp sản phẩm?",
        a: "• Vệ sinh hằng ngày: Bạn có thể dễ dàng lau sạch bụi mịn bằng khăn mềm ẩm hoặc rửa trực tiếp bằng nước ấm và xà phòng nhẹ.\n• Lưu ý nhiệt độ: Tránh để sản phẩm bên trong cabin ô tô đóng kín cửa đỗ lâu ngày dưới trời nắng gắt ngoài trời.\n• Hóa chất cần tránh: Tránh sử dụng các dung môi hòa tan mạnh như Acetone, cồn nồng độ cao hoặc xăng thơm để lau chùi bề mặt.",
      },
    ],
  },
  {
    id: "custom-workflow",
    title: "II. THIẾT KẾ THEO YÊU CẦU (CUSTOM DESIGN)",
    items: [
      {
        q: "04. Tôi muốn đặt thiết kế riêng theo ý tưởng cá nhân thì làm thế nào?",
        a: "Boo Space luôn sẵn sàng hiện thực hóa các ý tưởng độc bản của bạn qua 3 bước:\n\n1. Gửi ý tưởng: Bạn gửi thông tin mô tả, kích thước hoặc bản phác thảo qua mục Liên hệ hoặc Zalo của Boo Space.\n2. Tư vấn & Báo giá: Boo Space lắng nghe ý tưởng, gợi ý giải pháp tối ưu và gửi báo giá chi tiết, rõ ràng nhất.\n3. Chế tác & Giao hàng: Boo Space bắt tay chế tác tỉ mỉ và đóng gói cẩn thận gửi đến tận tay bạn.",
      },
    ],
  },
  {
    id: "payment-shipping",
    title: "III. THANH TOÁN & GIAO NHẬN",
    items: [
      {
        q: "05. Boo Space tính phí vận chuyển như thế nào? Có được miễn phí không?",
        a: "• Miễn phí vận chuyển (Free Shipping): Boo Space áp dụng chính sách miễn phí giao hàng đối với các đơn hàng tại khu vực nội thành TP. Hồ Chí Minh hoặc đơn hàng có tổng giá trị từ 500.000 ₫.\n• Khu vực ngoại thành & tỉnh lẻ: Cước phí vận chuyển được tính toán tự động theo biểu phí thực tế của các đơn vị vận chuyển liên kết (GHN / Viettel Post) dựa trên khoảng cách địa lý và kích thước đóng gói của kiện hàng. Mức phí hiển thị minh bạch tại bước checkout.",
      },
      {
        q: "06. Tôi có thể thanh toán đơn hàng bằng những phương thức nào?",
        a: "Chúng tôi cung cấp hai phương thức giao dịch tối giản và bảo mật tuyệt đối:\n\n1. Chuyển khoản VietQR tự động: Giao diện thanh toán khởi tạo mã VietQR động chứa chính xác số tiền và cú pháp mã đơn hàng. Hệ thống PayOS tự động xác nhận trạng thái 'Đã thanh toán' trong vài giây.\n2. Thanh toán khi nhận hàng (COD): Áp dụng cho đơn hàng tiêu chuẩn trên toàn quốc. Bạn thanh toán tiền mặt trực tiếp cho nhân viên giao hàng của GHN / Viettel Post sau khi kiểm hàng thành công.",
      },
      {
        q: "07. Tôi có được đồng kiểm (kiểm tra hàng) khi nhận không?",
        a: "Có. Boo Space luôn khuyến khích khách hàng đồng kiểm cùng shipper khi nhận hàng. Bạn được quyền mở hộp để kiểm tra ngoại quan sản phẩm (đúng mẫu mã, màu sắc, số lượng, sản phẩm nguyên vẹn không sứt mẻ/nứt vỡ do va đập vận chuyển).",
      },
    ],
  },
  {
    id: "after-sales",
    title: "IV. CHÍNH SÁCH HẬU MÃI (BẢO HÀNH & ĐỔI TRẢ)",
    items: [
      {
        q: "08. Chính sách đổi trả và hoàn tiền của Boo Space quy định thế nào?",
        a: "Chúng tôi cung cấp lớp bảo hiểm minh bạch để bạn hoàn toàn an tâm khi mua sắm:\n\n• Đổi 1-đổi-1 miễn phí trong 07 ngày: Áp dụng nếu sản phẩm phát sinh khuyết điểm hoàn thiện từ xưởng hoặc bị hư hỏng do vận chuyển. Boo Space chịu 100% phí ship 2 chiều.\n• Hỗ trợ đổi mẫu/size trong 03 ngày: Áp dụng cho sản phẩm bán sẵn còn nguyên vẹn vỏ hộp, tem mác và chưa qua sử dụng, khách hàng chịu chi phí vận chuyển 2 chiều.\n• Ngoại lệ: Không hỗ trợ đổi trả vì lý do đổi ý cá nhân đối với các sản phẩm đặt chế tác riêng theo yêu cầu.",
      },
    ],
  },
];

export default function FAQPage() {
  const cleanPhoneLink = siteConfig.contact.phone.replace(/[^0-9+]/g, "");

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50 text-left">
        {/* HEADER SECTION */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <HelpCircle className="size-3.5 text-[#FF9D00]" />
              07 / USER HELP &amp; FAQ
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Câu hỏi thường gặp
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#5C564E] leading-relaxed max-w-2xl pt-1">
              Tại Boo Space, chúng tôi tin rằng sự tĩnh lặng và ngăn nắp của
              không gian sống bắt đầu từ sự minh bạch hằng ngày. Dưới đây là
              những giải đáp giúp bạn hiểu rõ hơn về chất liệu chế tác, quy
              trình đặt hàng và các cam kết bảo vệ quyền lợi của chúng tôi.
            </p>
          </div>
        </div>

        {/* ACCORDION FAQ BY SECTIONS */}
        <div className="space-y-10">
          {faqSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-black border-b border-[#E1DDD5] pb-2 text-amber-900/80">
                {section.title}
              </h2>

              <Accordion className="space-y-2">
                {section.items.map((item, index) => (
                  <AccordionItem
                    key={`${section.id}-${index}`}
                    value={`${section.id}-${index}`}
                    className="border border-[#E1DDD5] bg-white rounded-2xl px-5 transition-all"
                  >
                    <AccordionTrigger className="text-left font-serif font-bold text-[#1E1C1A] hover:text-[#FF9D00] text-sm sm:text-base py-4 leading-snug">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#5C564E] text-xs sm:text-sm leading-relaxed pb-5 whitespace-pre-line font-sans border-t border-[#E1DDD5]/40 pt-3">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* SUPPORT CALLOUT BOX — NẠP ĐỘNG TỪ CONFIG */}
        <div className="mt-14 rounded-3xl border border-[#E1DDD5] bg-[#EAE5D9]/30 p-8 text-center space-y-4 shadow-xs">
          <div className="size-12 rounded-full bg-white border border-[#E1DDD5] flex items-center justify-center mx-auto text-[#FF9D00]">
            <Headphones className="size-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-serif text-black">
              Vẫn còn thắc mắc?
            </h2>
            <p className="text-xs sm:text-sm text-[#5C564E] max-w-md mx-auto leading-relaxed">
              Không tìm thấy câu trả lời bạn cần? Đội ngũ Boo Space luôn sẵn
              sàng đồng hành, tư vấn và hỗ trợ bạn chăm chút cho không gian sống của mình.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono font-bold text-black">
            <a
              href={`tel:${cleanPhoneLink}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E1DDD5] hover:border-[#FF9D00] transition-colors"
            >
              <Phone className="size-3.5 text-[#FF9D00]" />{" "}
              {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E1DDD5] hover:border-[#FF9D00] transition-colors"
            >
              <Mail className="size-3.5 text-[#FF9D00]" />{" "}
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF9D00] font-bold hover:underline"
            >
              Liên hệ gửi file thiết kế ngay →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
