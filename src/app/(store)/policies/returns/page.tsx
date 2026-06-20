import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đổi trả & hoàn tiền",
  description:
    "Chính sách đổi trả và hoàn tiền dành cho khách hàng tại Boo Space.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Chính sách đổi trả & hoàn tiền
      </h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <p>
          Tại Boo Space, chúng tôi cam kết mang đến sản phẩm chất lượng và trải
          nghiệm mua sắm đáng tin cậy. Nếu sản phẩm gặp lỗi hoặc không đúng mô
          tả, khách hàng có thể yêu cầu đổi trả theo chính sách dưới đây.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          1. Quy trình đổi trả
        </h2>

        <ol className="list-inside list-decimal space-y-2">
          <li>
            Liên hệ bộ phận Chăm sóc khách hàng của Boo Space để đăng ký đổi
            trả.
          </li>
          <li>
            Boo Space xác nhận thông tin đơn hàng và điều kiện áp dụng đổi trả.
          </li>
          <li>
            Tiến hành đổi sản phẩm hoặc hoàn tiền theo chính sách hiện hành.
          </li>
        </ol>

        <p>
          <strong>Lưu ý:</strong> Khách hàng cần cung cấp hình ảnh hoặc video
          sản phẩm lỗi để được hỗ trợ nhanh chóng. Thời gian xử lý yêu cầu đổi
          trả trong vòng <strong>07 ngày làm việc</strong> kể từ khi nhận đầy đủ
          thông tin.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          2. Thời gian đổi trả
        </h2>

        <h3 className="text-lg font-medium text-foreground">
          Trong vòng 30 ngày kể từ ngày nhận hàng
        </h3>

        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>Sản phẩm lỗi từ nhà sản xuất:</strong> Đổi mới hoặc hoàn
            tiền 100% nếu không có sản phẩm thay thế.
          </li>
          <li>
            <strong>Sản phẩm không lỗi:</strong> Hỗ trợ đổi/trả theo điều kiện
            áp dụng.
          </li>
          <li>
            <strong>Lỗi do người sử dụng:</strong> Không hỗ trợ đổi trả.
          </li>
        </ul>

        <h3 className="text-lg font-medium text-foreground">
          Sau 30 ngày kể từ ngày nhận hàng
        </h3>

        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>Sản phẩm lỗi từ nhà sản xuất:</strong> Hỗ trợ bảo hành hoặc
            hoàn tiền tùy theo tình trạng thực tế.
          </li>
          <li>
            <strong>Sản phẩm không lỗi:</strong> Xem xét hỗ trợ đổi/trả theo
            từng trường hợp cụ thể.
          </li>
          <li>
            <strong>Lỗi do người sử dụng:</strong> Hỗ trợ sửa chữa có tính phí
            (nếu có).
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          3. Điều kiện đổi trả
        </h2>

        <p>Sản phẩm được chấp nhận đổi trả khi đáp ứng các điều kiện sau:</p>

        <ul className="list-inside list-disc space-y-2">
          <li>Còn nguyên tem niêm phong (nếu có).</li>
          <li>Còn đầy đủ phụ kiện, quà tặng kèm và chứng từ mua hàng.</li>
          <li>Không bị hư hỏng, trầy xước hoặc biến dạng do người sử dụng.</li>
          <li>
            Được xác nhận lỗi kỹ thuật từ nhà sản xuất hoặc thuộc trường hợp hỗ
            trợ đổi trả theo quy định.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          4. Chi phí đổi trả
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>
            Sản phẩm lỗi từ nhà sản xuất: Boo Space hỗ trợ toàn bộ chi phí vận
            chuyển đổi trả.
          </li>
          <li>
            Sản phẩm không lỗi: Khách hàng chịu các chi phí vận chuyển phát
            sinh.
          </li>
          <li>
            Trường hợp đổi sang sản phẩm khác: Khách hàng thanh toán phần chênh
            lệch giá trị (nếu có).
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          5. Các trường hợp không hỗ trợ đổi trả
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>Sản phẩm hư hỏng do sử dụng sai hướng dẫn.</li>
          <li>
            Sản phẩm bị rách bao bì, trầy xước, móp méo hoặc vỡ do người sử
            dụng.
          </li>
          <li>
            Yêu cầu đổi trả không được thông báo trước với bộ phận Chăm sóc
            khách hàng.
          </li>
          <li>
            Sản phẩm thuộc chương trình giảm giá từ 30% trở lên (nếu có quy định
            riêng).
          </li>
          <li>
            Các trường hợp bất khả kháng như thiên tai, dịch bệnh hoặc sự cố
            ngoài tầm kiểm soát.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">6. Hoàn tiền</h2>

        <p>
          Khách hàng cung cấp thông tin tài khoản ngân hàng để nhận hoàn tiền.
          Thời gian hoàn tiền dự kiến từ <strong>07–14 ngày làm việc</strong>{" "}
          sau khi yêu cầu đổi trả được xác nhận đủ điều kiện.
        </p>

        <p>
          Nếu cần hỗ trợ thêm, vui lòng liên hệ Boo Space qua email{" "}
          <strong>boospace7@gmail.com</strong> hoặc fanpage chính thức của chúng
          tôi.
        </p>
      </div>
    </div>
  );
}
