import { AuthListener } from "@/components/auth/auth-listener";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { BackToTop } from "@/components/layout/back-to-top";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { categoryRepository } from "@/lib/repositories";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bổ sung .catch(() => []) để đảm bảo nếu Supabase gián đoạn thì Header vẫn hoạt động an toàn
  const categories = await categoryRepository.list().catch(() => []);

  return (
    <>
      {/* Bộ lắng nghe trạng thái đăng nhập tài khoản chạy ngầm */}
      <AuthListener />

      {/* Khung thông báo Cookie nổi */}
      <CookieConsent />

      {/* Phím tắt bỏ qua nhanh nội dung hỗ trợ chuẩn Accessibility WCAG */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      {/* Thanh thông báo chạy chữ đầu trang */}
      <AnnouncementBar />

      {/* Header thanh điều hướng kết nối database */}
      <Header categories={categories} />

      {/* Main Landmark nội dung chính chuẩn Accessibility */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer chân trang */}
      <Footer />

      {/* Cart Drawer & Phím cuộn lên đầu trang */}
      <CartDrawer />
      <BackToTop />
    </>
  );
}
