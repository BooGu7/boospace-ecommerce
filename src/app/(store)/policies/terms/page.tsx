import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ",
  description:
    "Các điều khoản và điều kiện khi sử dụng website và dịch vụ của Boo Space.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Điều khoản sử dụng website
      </h1>

      <p className="mt-4 text-sm text-muted-foreground">
        Cập nhật lần cuối: 01/01/2026
      </p>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">
          1. Quy định chung
        </h2>

        <p>
          Khi truy cập và sử dụng website của Boo Space, bạn đồng ý với các điều
          khoản sử dụng, chính sách bảo mật và các quy định liên quan.
        </p>

        <p>
          Boo Space có quyền áp dụng các quy định theo pháp luật hiện hành và
          yêu cầu của cơ quan nhà nước có thẩm quyền liên quan đến việc sử dụng
          dịch vụ.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          2. Từ chối bảo đảm
        </h2>

        <p>
          Website và dịch vụ của Boo Space được cung cấp theo nguyên tắc “có
          sẵn” và không bảo đảm tuyệt đối về tính liên tục, không lỗi hoặc đáp
          ứng mọi nhu cầu của người dùng.
        </p>

        <p>
          Boo Space không chịu trách nhiệm đối với các thiệt hại phát sinh từ
          việc sử dụng hoặc không thể sử dụng website, bao gồm mất dữ liệu hoặc
          gián đoạn dịch vụ.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          3. Thay đổi điều khoản
        </h2>

        <p>
          Boo Space có quyền thay đổi nội dung điều khoản bất kỳ lúc nào. Các
          thay đổi có hiệu lực ngay khi được đăng tải trên website.
        </p>

        <p>
          Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các
          thay đổi đó.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          4. Sử dụng dịch vụ
        </h2>

        <p>Khi sử dụng dịch vụ, bạn có trách nhiệm:</p>

        <ul className="list-inside list-disc space-y-2">
          <li>Thanh toán đầy đủ phí dịch vụ (nếu có)</li>
          <li>Tuân thủ quy định pháp luật hiện hành</li>
          <li>Hợp tác giải quyết tranh chấp trên tinh thần thỏa thuận</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          5. Tài khoản & thanh toán
        </h2>

        <p>
          Người dùng cần cung cấp thông tin chính xác khi đăng ký và sử dụng
          dịch vụ.
        </p>

        <p>
          Bạn đồng ý tuân thủ các quy định về đăng ký, sử dụng và thanh toán
          được Boo Space công bố trên website. Các quy định này có thể được cập
          nhật theo thời gian và có hiệu lực ngay khi đăng tải.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          6. Giới hạn trách nhiệm
        </h2>

        <p>Boo Space không chịu trách nhiệm đối với:</p>

        <ul className="list-inside list-disc space-y-2">
          <li>Nội dung do người dùng cung cấp</li>
          <li>Thiệt hại phát sinh từ việc sử dụng dịch vụ</li>
          <li>Khiếu nại từ bên thứ ba liên quan đến hành vi người dùng</li>
        </ul>

        <p>
          Người dùng tự chịu trách nhiệm đối với thông tin và nội dung mình cung
          cấp.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          7. Sở hữu trí tuệ
        </h2>

        <p>
          Toàn bộ nội dung, thiết kế, phần mềm và tài nguyên trên website thuộc
          quyền sở hữu của Boo Space hoặc bên cấp phép hợp pháp.
        </p>

        <p>
          Bạn không được sao chép, sử dụng hoặc khai thác cho mục đích thương
          mại khi chưa có sự đồng ý bằng văn bản.
        </p>

        <p>
          Người dùng không được đăng tải nội dung vi phạm bản quyền hoặc quyền
          sở hữu trí tuệ của bên thứ ba.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          8. Điều khoản khác
        </h2>

        <p>
          <strong>Luật áp dụng:</strong> Điều khoản này được điều chỉnh theo
          pháp luật Việt Nam.
        </p>

        <p>
          <strong>Chấm dứt sử dụng:</strong>
        </p>

        <ul className="list-inside list-disc space-y-2">
          <li>Người dùng có thể dừng sử dụng dịch vụ bất kỳ lúc nào.</li>
          <li>
            Boo Space có quyền chấm dứt dịch vụ nếu người dùng vi phạm điều
            khoản hoặc theo yêu cầu pháp luật.
          </li>
        </ul>

        <p>
          Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ Boo Space
          qua email <strong>boospace7@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}
