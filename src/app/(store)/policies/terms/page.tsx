import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ",
  description:
    "Các điều khoản và điều kiện khi sử dụng website và dịch vụ của chúng tôi ✨",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Điều khoản dịch vụ</h1>

      <p className="mt-4 text-sm text-muted-foreground">
        Cập nhật lần cuối: 01/01/2026
      </p>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">
          Chấp nhận điều khoản
        </h2>

        <p>
          Khi truy cập và sử dụng website này, bạn đồng ý bị ràng buộc bởi các
          Điều khoản dịch vụ này. Nếu bạn không đồng ý, vui lòng không sử dụng
          dịch vụ của chúng tôi.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Sử dụng dịch vụ
        </h2>

        <p>
          Bạn đồng ý chỉ sử dụng dịch vụ cho các mục đích hợp pháp và tuân thủ
          các điều khoản này. Bạn có trách nhiệm bảo mật thông tin tài khoản của
          mình.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Sản phẩm và giá cả
        </h2>

        <p>
          Chúng tôi luôn cố gắng hiển thị thông tin sản phẩm và giá chính xác.
          Tuy nhiên, đôi khi vẫn có thể xảy ra sai sót. Chúng tôi có quyền chỉnh
          sửa lỗi và hủy các đơn hàng được đặt với giá không chính xác.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Sở hữu trí tuệ
        </h2>

        <p>
          Toàn bộ nội dung trên website, bao gồm văn bản, hình ảnh và logo, đều
          được bảo vệ bởi luật sở hữu trí tuệ. Bạn không được sao chép hoặc phân
          phối nội dung khi chưa có sự cho phép bằng văn bản từ chúng tôi.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Giới hạn trách nhiệm
        </h2>

        <p>
          Trong phạm vi tối đa được pháp luật cho phép, chúng tôi không chịu
          trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc hệ quả
          nào phát sinh từ việc sử dụng dịch vụ.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Liên hệ</h2>

        <p>
          Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ chúng tôi
          qua boospace7@gmail.com.
        </p>
      </div>
    </div>
  );
}
