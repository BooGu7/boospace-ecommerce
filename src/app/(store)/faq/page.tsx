import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description:
    "Giải đáp các câu hỏi phổ biến về đơn hàng, vận chuyển, đổi trả và nhiều hơn nữa ✨",
};

const faqs = [
  {
    question: "Thời gian giao hàng mất bao lâu?",
    answer:
      "Giao hàng tiêu chuẩn thường mất 5–7 ngày làm việc. Bạn cũng có thể chọn giao hàng nhanh tại bước thanh toán với thời gian 2–3 ngày làm việc.",
  },
  {
    question: "Chính sách đổi trả như thế nào?",
    answer:
      "Chúng tôi hỗ trợ đổi trả trong vòng 30 ngày cho tất cả sản phẩm. Sản phẩm cần còn nguyên tình trạng ban đầu và đầy đủ tem mác. Xem trang đổi trả để biết thêm chi tiết.",
  },
  {
    question: "Có giao hàng quốc tế không?",
    answer:
      "Có, chúng tôi giao hàng đến hầu hết các quốc gia trên thế giới. Phí vận chuyển và thời gian giao hàng sẽ thay đổi tùy theo điểm đến. Bạn có thể xem chi phí chính xác tại bước thanh toán.",
  },
  {
    question: "Làm sao để theo dõi đơn hàng?",
    answer:
      "Sau khi đơn hàng được gửi đi, bạn sẽ nhận email xác nhận kèm mã theo dõi. Bạn cũng có thể theo dõi đơn hàng trong trang tài khoản của mình.",
  },
  {
    question: "Bạn chấp nhận những phương thức thanh toán nào?",
    answer:
      "Chúng tôi chấp nhận thẻ tín dụng (Visa, Mastercard, American Express), PayPal và Apple Pay. Tất cả giao dịch đều được bảo mật bằng mã hóa SSL.",
  },
  {
    question: "Làm sao để liên hệ hỗ trợ khách hàng?",
    answer:
      "Bạn có thể liên hệ qua trang liên hệ, email support@store.com hoặc gọi (555) 123-4567. Đội ngũ hỗ trợ hoạt động từ Thứ Hai đến Thứ Sáu, 9h–17h (EST).",
  },
  {
    question: "Tôi có thể thay đổi hoặc hủy đơn hàng không?",
    answer:
      "Bạn có thể thay đổi hoặc hủy đơn hàng trong vòng 1 giờ sau khi đặt. Sau thời gian này, vui lòng liên hệ bộ phận hỗ trợ để được hỗ trợ thêm.",
  },
  {
    question: "Có thẻ quà tặng không?",
    answer:
      "Có! Thẻ quà tặng điện tử có các mệnh giá $25, $50, $100 và $200. Thẻ được gửi ngay qua email và không có hạn sử dụng.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Câu hỏi thường gặp</h1>

      <p className="mt-4 text-muted-foreground">
        Tìm câu trả lời cho những thắc mắc phổ biến về sản phẩm, vận chuyển và
        chính sách của chúng tôi.
      </p>

      <Accordion className="mt-8">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 rounded-lg border bg-neutral-50 p-6 text-center">
        <h2 className="text-lg font-semibold">Vẫn còn thắc mắc?</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Không tìm thấy câu trả lời bạn cần? Đội ngũ hỗ trợ luôn sẵn sàng giúp
          bạn ✨
        </p>

        <a
          href="/contact"
          className="mt-4 inline-block text-sm font-medium underline hover:text-foreground"
        >
          Liên hệ hỗ trợ
        </a>
      </div>
    </div>
  );
}
