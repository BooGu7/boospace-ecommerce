import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thông tin",
  description:
    "BooSpace — Studio thiết kế DIY & không gian làm việc in 3D theo yêu cầu",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Về BooSpace</h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <p>
          BooSpace là studio thiết kế không gian làm việc và sản phẩm DIY ứng
          dụng công nghệ in 3D hiện đại. Chúng tôi tạo ra các sản phẩm tùy chỉnh
          theo nhu cầu cá nhân, từ đồ trang trí, phụ kiện bàn làm việc cho đến
          các giải pháp tổ chức không gian sáng tạo.
        </p>

        <p>
          Với sự kết hợp giữa thiết kế tối giản, tư duy DIY và công nghệ in 3D,
          BooSpace giúp biến ý tưởng của bạn thành sản phẩm thực tế. Mỗi sản
          phẩm đều có thể được cá nhân hoá để phù hợp với phong cách, nhu cầu và
          không gian riêng của từng người dùng.
        </p>

        <h2 className="!mt-12 text-xl font-semibold text-foreground">
          Triết lý thiết kế
        </h2>

        <p>
          Chúng tôi tin rằng một không gian làm việc tốt không chỉ đẹp mà còn
          phải truyền cảm hứng. Mỗi thiết kế của BooSpace đều hướng đến sự gọn
          gàng, tối ưu công năng và mang dấu ấn cá nhân.
        </p>

        <h2 className="!mt-12 text-xl font-semibold text-foreground">
          Sản phẩm của chúng tôi
        </h2>

        <ul className="list-inside list-disc space-y-2">
          <li>Phụ kiện bàn làm việc in 3D theo yêu cầu</li>
          <li>Đồ trang trí tối giản cho không gian làm việc</li>
          <li>Giải pháp lưu trữ và sắp xếp đồ dùng</li>
          <li>Sản phẩm DIY tùy chỉnh theo ý tưởng cá nhân</li>
          <li>Thiết kế prototype và mẫu thử nhanh bằng in 3D</li>
        </ul>

        <h2 className="!mt-12 text-xl font-semibold text-foreground">
          Tại sao chọn BooSpace?
        </h2>

        <p>
          Chúng tôi không chỉ bán sản phẩm, mà tạo ra giải pháp cá nhân hóa cho
          không gian sống và làm việc. Mỗi sản phẩm được thiết kế để phù hợp với
          bạn, không phải ngược lại.
        </p>
      </div>
    </div>
  );
}
