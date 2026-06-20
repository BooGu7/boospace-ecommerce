import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn tại Boo Space.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Chính sách bảo mật thông tin
      </h1>

      <p className="mt-4 text-sm text-muted-foreground">
        Cập nhật lần cuối: 01/01/2026
      </p>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">1. Giới thiệu</h2>

        <p>
          Boo Space cam kết tôn trọng và bảo vệ quyền riêng tư của khách hàng.
          Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và
          bảo vệ thông tin cá nhân khi bạn sử dụng website, sản phẩm và dịch vụ
          của Boo Space.
        </p>

        <p>
          Khi sử dụng dịch vụ của Boo Space, bạn đồng ý với các nội dung được
          quy định trong Chính sách bảo mật này.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          2. Thông tin chúng tôi thu thập
        </h2>

        <p>Chúng tôi có thể thu thập các thông tin sau:</p>

        <ul className="list-inside list-disc space-y-2">
          <li>Họ và tên</li>
          <li>Số điện thoại</li>
          <li>Địa chỉ email</li>
          <li>Địa chỉ nhận hàng</li>
          <li>Thông tin thanh toán (nếu cần)</li>
          <li>Thông tin thiết bị, trình duyệt và hành vi sử dụng website</li>
        </ul>

        <p>Thông tin được thu thập khi bạn:</p>

        <ul className="list-inside list-disc space-y-2">
          <li>Đăng ký tài khoản hoặc đặt hàng</li>
          <li>Liên hệ với Boo Space</li>
          <li>Tham gia chương trình khuyến mãi, sự kiện hoặc khảo sát</li>
          <li>Sử dụng website và các dịch vụ của chúng tôi</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          3. Mục đích sử dụng thông tin
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>Xử lý đơn hàng và giao dịch</li>
          <li>Liên hệ và hỗ trợ khách hàng</li>
          <li>Cập nhật sản phẩm, dịch vụ và ưu đãi</li>
          <li>Nâng cao chất lượng trải nghiệm người dùng</li>
          <li>Đáp ứng yêu cầu theo quy định pháp luật</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          4. Chia sẻ thông tin
        </h2>

        <p>
          Boo Space không bán hoặc trao đổi thông tin cá nhân của khách hàng cho
          bên thứ ba.
        </p>

        <p>Thông tin chỉ được chia sẻ trong các trường hợp cần thiết như:</p>

        <ul className="list-inside list-disc space-y-2">
          <li>Đơn vị vận chuyển và thanh toán</li>
          <li>Đối tác hỗ trợ vận hành dịch vụ</li>
          <li>Cơ quan nhà nước có thẩm quyền theo yêu cầu pháp luật</li>
        </ul>

        <p>
          Tất cả các bên liên quan đều có trách nhiệm bảo mật thông tin khách
          hàng.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          5. Bảo mật thông tin
        </h2>

        <p>
          Boo Space áp dụng các biện pháp kỹ thuật và quản lý phù hợp để bảo vệ
          dữ liệu cá nhân khỏi việc truy cập, sử dụng hoặc tiết lộ trái phép.
        </p>

        <p>
          Tuy nhiên, không có phương thức truyền tải dữ liệu nào trên Internet
          đảm bảo an toàn tuyệt đối. Chúng tôi luôn nỗ lực bảo vệ thông tin ở
          mức cao nhất có thể.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          6. Quyền của khách hàng
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>Yêu cầu xem, cập nhật hoặc chỉnh sửa thông tin cá nhân</li>
          <li>Yêu cầu xóa dữ liệu theo quy định pháp luật</li>
          <li>Rút lại sự đồng ý đối với việc xử lý dữ liệu cá nhân</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          7. Thay đổi chính sách
        </h2>

        <p>
          Boo Space có thể cập nhật chính sách bảo mật theo từng thời điểm để
          phù hợp với quy định pháp luật và hoạt động kinh doanh. Mọi thay đổi
          sẽ được công bố trên website.
        </p>

        <h2 className="text-xl font-semibold text-foreground">8. Liên hệ</h2>

        <p>
          Nếu có bất kỳ thắc mắc nào liên quan đến chính sách bảo mật, vui lòng
          liên hệ Boo Space qua email <strong>boospace7@gmail.com</strong> hoặc
          các kênh hỗ trợ chính thức trên website.
        </p>
      </div>
    </div>
  );
}
