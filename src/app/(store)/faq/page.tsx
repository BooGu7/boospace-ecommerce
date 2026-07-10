import type { Metadata } from "next";
import Link from "next/link"; // ĐÃ SỬA LỖI: Bổ sung import Link từ next/link
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp — Boo Space FAQ",
  description:
    "Giải đáp các câu hỏi phổ biến về đơn hàng, vận chuyển, đổi trả và thiết kế in 3D custom ✨",
};

const faqs = [
  {
    question: "Xưởng in 3D Boo Space sử dụng phôi liệu nhựa gì?",
    answer:
      "Chúng tôi ưu tiên sử dụng nhựa PLA tự nhiên phân hủy sinh học (thân thiện với môi trường) và nhựa gỗ hữu cơ chứa phôi gỗ thông để gia công mộc mạc, tạo cảm giác xúc giác chân thực.",
  },
  {
    question: "Có hỗ trợ chỉnh sửa kích thước mô hình theo yêu cầu không?",
    answer:
      "Có! Bạn có thể vào trang liên hệ để gửi file STL/OBJ hoặc ý tưởng, đội ngũ kỹ sư của Boo Space sẽ hỗ trợ Slicing và in 3D đúng chuẩn kích thước bạn cần.",
  },
  {
    question: "Thời gian in 3D và giao hàng mất bao lâu?",
    answer:
      "Do đặc thù chế tác chậm, các đơn hàng in 3D thường mất 2-3 ngày để hoàn thiện thô và đóng gói, sau đó vận chuyển tiêu chuẩn đến tay bạn trong 2-3 ngày tiếp theo.",
  },
  {
    question: "Lại thế nào để bảo quản gỗ của Sol-01?",
    answer:
      "Bộ gỗ SOL-01 đã được phủ sẵn dầu bảo quản tự nhiên. Bạn chỉ cần lau chùi bằng khăn giấy khô mềm hàng tuần, tránh tiếp xúc trực tiếp với nước hoặc ánh nắng gắt nhiệt độ cao.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              07 / USER HELP &amp; FAQ
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Câu hỏi thường gặp
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Giải đáp các câu hỏi phổ biến về vận hành và chính sách cửa hàng
            </p>
          </div>
        </div>

        <Accordion className="mt-8">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-[#E1DDD5]"
            >
              <AccordionTrigger className="text-left font-serif font-bold text-[#1E1C1A] hover:text-[#FF9D00] text-base py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#5C564E] text-sm leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-3xl border border-[#E1DDD5] bg-[#EAE5D9]/20 p-8 text-center space-y-4">
          <h2 className="text-lg font-bold font-serif text-black">
            Vẫn còn thắc mắc?
          </h2>
          <p className="text-xs sm:text-sm text-[#5C564E] max-w-md mx-auto leading-relaxed">
            Không tìm thấy câu trả lời bạn cần? Đội ngũ hỗ trợ của Boo Space
            luôn sẵn sàng đồng hành cùng bạn ✨
          </p>
          <Link
            href="/contact"
            className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF9D00] font-bold hover:underline"
          >
            Liên hệ hỗ trợ ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
