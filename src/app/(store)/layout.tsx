import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { BackToTop } from "@/components/layout/back-to-top";
import { categoryRepository } from "@/lib/repositories";
import { AuthListener } from "@/components/auth/auth-listener"; // Đồng bộ hóa tài khoản Google OAuth [21]
import { CookieConsent } from "@/components/layout/cookie-consent"; // Khung thông báo bảo mật Cookie nổi

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lấy danh mục sản phẩm thời gian thực trực tiếp từ Supabase để Header luôn đồng bộ dữ liệu mới nhất
  const categories = await categoryRepository.list();

  return (
    <>
      {/* Kích hoạt bộ lắng nghe đồng bộ hóa trạng thái tài khoản chạy ngầm toàn trang */}
      <AuthListener />

      {/* Kích hoạt thông báo bảo mật Cookie dẹt nổi góc dưới bên trái */}
      <CookieConsent />

      {/* Phím tắt bỏ qua nhanh nội dung (Skip-to-content) hỗ trợ chuẩn Accessibility (a11y) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      {/* Announcement bar chạy chữ vô cực của Daylight */}
      <AnnouncementBar />

      {/* Header thanh điều hướng động kết nối database */}
      <Header categories={categories} />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer tối giản dẹt dẹp, tích hợp đăng ký email lồng dẹt */}
      <Footer />

      {/* Drawer giỏ hàng và nút Smooth Scroll cuộn lên đầu trang */}
      <CartDrawer />
      <BackToTop />
    </>
  );
}
