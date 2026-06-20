import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển",
  description:
    "Tìm hiểu về các lựa chọn vận chuyển, chi phí và thời gian giao hàng ✨",
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Chính sách vận chuyển
      </h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">
          Vận chuyển trong nước
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>Giao hàng tiêu chuẩn (3–5 ngày làm việc): 25.000₫</li>
          <li>Giao hàng nhanh (1–2 ngày làm việc): 45.000₫</li>
          <li>Giao hàng hỏa tốc (trong ngày / nội thành): 90.000₫</li>
          <li>Miễn phí vận chuyển cho đơn hàng từ 500.000₫ trở lên</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          Vận chuyển nội thành & ngoại tỉnh
        </h2>

        <p>
          Chúng tôi giao hàng trên toàn quốc Việt Nam. Thời gian giao hàng nội
          thành thường từ 1–2 ngày, ngoại tỉnh từ 3–5 ngày làm việc tùy khu vực.
          Một số vùng xa có thể mất 5–7 ngày làm việc.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Xử lý đơn hàng
        </h2>

        <p>
          Đơn hàng được xử lý trong vòng 24 giờ (ngày làm việc). Đơn đặt sau
          17:00 hoặc vào cuối tuần sẽ được xử lý vào ngày làm việc tiếp theo.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Theo dõi đơn hàng
        </h2>

        <p>
          Sau khi đơn hàng được gửi đi, bạn sẽ nhận được tin nhắn/email kèm mã
          vận đơn để theo dõi. Bạn cũng có thể xem trạng thái đơn hàng trong mục
          tài khoản của mình.
        </p>
      </div>
    </div>
  );
}
