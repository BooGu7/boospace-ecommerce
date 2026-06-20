import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đổi trả & hoàn tiền",
  description: "Chính sách đổi trả đơn giản, dễ dàng trong 30 ngày ✨",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Đổi trả & hoàn tiền</h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">
          Chính sách đổi trả 30 ngày
        </h2>

        <p>
          Chúng tôi mong bạn hoàn toàn hài lòng với sản phẩm của mình. Nếu bạn
          chưa ưng ý với đơn hàng, bạn có thể đổi trả trong vòng 30 ngày kể từ
          ngày nhận hàng để được hoàn tiền đầy đủ.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Điều kiện đổi trả
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>Sản phẩm chưa qua sử dụng và còn nguyên bao bì</li>
          <li>Còn đầy đủ tem, nhãn mác</li>
          <li>Hàng giảm giá không áp dụng đổi trả</li>
          <li>Thẻ quà tặng không được hoàn tiền</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          Cách thức đổi trả
        </h2>

        <ol className="list-inside list-decimal space-y-2">
          <li>Đăng nhập tài khoản và vào Lịch sử đơn hàng</li>
          <li>Chọn đơn hàng và sản phẩm muốn đổi trả</li>
          <li>In nhãn vận chuyển trả hàng đã được cung cấp</li>
          <li>
            Đóng gói sản phẩm cẩn thận và gửi tại điểm vận chuyển gần nhất
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-foreground">Hoàn tiền</h2>

        <p>
          Tiền hoàn sẽ được xử lý trong vòng 5–7 ngày làm việc sau khi chúng tôi
          nhận được hàng trả. Số tiền sẽ được hoàn về phương thức thanh toán ban
          đầu của bạn.
        </p>
      </div>
    </div>
  );
}
