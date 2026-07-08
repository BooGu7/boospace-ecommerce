export interface NavItem {
  name: string;
  href: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

// ============================================================================
// Navigation Structure — Single source of truth for all navigation
// across desktop header, mobile menu, sitemaps and other footer links.
// ============================================================================

export const shopLinks: NavItem[] = [
  { name: "Trang chủ", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "Liên hệ", href: "/contact" },
];

export const accountLinks: NavItem[] = [
  { name: "Tài khoản", href: "/account" },
  { name: "Yêu thích ❤️", href: "/wishlist" },
  { name: "Đơn hàng", href: "/account/orders" },
];

export const infoLinks: NavItem[] = [
  { name: "Blog", href: "/blog" },
  { name: "Liên hệ", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

export const mobileMenuSections: NavSection[] = [
  { label: "Shop", items: shopLinks },
  { label: "Tài khoản", items: accountLinks },
  { label: "Thông tin", items: infoLinks },
];

// NÂNG CẤP: Đã thêm từ khóa export để làm nguồn dữ liệu chuẩn duy nhất
export const footerLinks = {
  shop: [
    { name: "Tất cả sản phẩm", href: "/shop" },
    { name: "Sản phẩm mới", href: "/shop?sort=newest" },
    { name: "Khuyến mãi", href: "/shop?sale=true" },
  ],
  company: [
    { name: "Giới thiệu", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Liên hệ", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Chính sách vận chuyển", href: "/policies/shipping" },
    { name: "Đổi trả & hoàn tiền", href: "/policies/returns" },
    { name: "Chính sách bảo mật", href: "/policies/privacy" },
    { name: "Điều khoản sử dụng", href: "/policies/terms" },
  ],
};
