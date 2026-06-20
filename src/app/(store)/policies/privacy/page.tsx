import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn ✨",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Chính sách bảo mật</h1>

      <p className="mt-4 text-sm text-muted-foreground">
        Cập nhật lần cuối: 01/01/2026
      </p>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">
          Thông tin chúng tôi thu thập
        </h2>

        <p>
          Chúng tôi thu thập những thông tin bạn cung cấp trực tiếp, chẳng hạn
          như tên, email, địa chỉ giao hàng và thông tin thanh toán khi bạn mua
          hàng. Ngoài ra, chúng tôi cũng tự động thu thập một số thông tin về
          thiết bị và hoạt động duyệt web của bạn.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Cách chúng tôi sử dụng thông tin
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>Để xử lý và hoàn tất đơn hàng của bạn</li>
          <li>Để liên hệ với bạn về đơn hàng</li>
          <li>Để gửi email khuyến mãi (khi bạn đồng ý)</li>
          <li>Để cải thiện website và dịch vụ</li>
          <li>Để phát hiện và ngăn chặn gian lận</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          Bảo vệ dữ liệu
        </h2>

        <p>
          Chúng tôi áp dụng các biện pháp bảo mật theo tiêu chuẩn ngành để bảo
          vệ thông tin cá nhân của bạn. Dữ liệu thanh toán được xử lý an toàn và
          không bao giờ được lưu trữ trên hệ thống của chúng tôi.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Quyền của bạn</h2>

        <p>
          Bạn có quyền truy cập, cập nhật hoặc xóa thông tin cá nhân của mình
          bất cứ lúc nào. Vui lòng liên hệ chúng tôi qua boospace7@gmail.com nếu
          bạn có yêu cầu.
        </p>
      </div>
    </div>
  );
}
