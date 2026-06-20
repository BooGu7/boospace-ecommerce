import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển",
  description:
    "Thông tin về phạm vi giao hàng, thời gian vận chuyển và chính sách hỗ trợ khách hàng của BooSpace.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Chính sách vận chuyển
      </h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">
          Phạm vi giao hàng
        </h2>

        <p>
          Boo Space phục vụ khách hàng trên toàn lãnh thổ Việt Nam. Hiện tại,
          chúng tôi chưa hỗ trợ giao hàng quốc tế.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Đối tác vận chuyển
        </h2>

        <p>
          Đơn hàng của bạn sẽ được giao thông qua đội ngũ vận chuyển của Boo
          Space hoặc các đối tác uy tín như Viettel Post và Lalamove, tùy thuộc
          vào khu vực giao hàng và hình thức vận chuyển phù hợp.
        </p>

        <p>
          Sau khi đơn hàng được bàn giao cho đơn vị vận chuyển, quý khách sẽ
          nhận được email hoặc tin nhắn chứa mã vận đơn để theo dõi trạng thái
          giao hàng.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Thời gian giao hàng
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>TP. Hồ Chí Minh:</strong> Thời gian giao hàng dự kiến từ 1–3
            ngày làm việc (không bao gồm Thứ Bảy, Chủ Nhật và ngày lễ).
          </li>
          <li>
            <strong>Các tỉnh thành khác:</strong> Thời gian giao hàng dự kiến từ
            3–5 ngày làm việc (không bao gồm Thứ Bảy, Chủ Nhật và ngày lễ).
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          Phí vận chuyển
        </h2>

        <p>
          Boo Space áp dụng chính sách{" "}
          <strong>miễn phí vận chuyển toàn quốc</strong> cho tất cả đơn hàng.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Theo dõi đơn hàng
        </h2>

        <p>
          Quý khách có thể tra cứu tình trạng vận chuyển thông qua mã vận đơn
          được gửi qua email. Đối với các đơn hàng được giao bởi Viettel Post,
          vui lòng truy cập website của đơn vị vận chuyển để kiểm tra trạng thái
          mới nhất.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Hỗ trợ & khiếu nại
        </h2>

        <p>
          Nếu có bất kỳ thắc mắc nào liên quan đến đơn hàng, chất lượng sản
          phẩm, phí vận chuyển hoặc quá trình giao nhận, vui lòng liên hệ với
          Boo Space để được hỗ trợ nhanh nhất.
        </p>

        <ul className="list-inside list-disc space-y-2">
          <li>Email: boospace7@gmail.com</li>
          <li>Fanpage: Boo Space</li>
        </ul>
      </div>
    </div>
  );
}
