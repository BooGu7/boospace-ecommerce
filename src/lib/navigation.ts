export interface NavItem {
  name: string;
  href: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

// Single source of truth for all navigation across desktop header,
// mobile menu, and anywhere else. Edit this one file to update all menus.

export const shopLinks: NavItem[] = [
  { name: "Trang chủ", href: "/" },
  { name: "Phụ kiện", href: "/accessories" },
  { name: "Blog", href: "/blog" },
  { name: "Thông tin", href: "/about" },
  { name: "Liên hệ", href: "/contact" },
];

export const accountLinks: NavItem[] = [
  { name: "Tài khoản", href: "/account" },
  { name: "Yêu thích ❤️", href: "/wishlist" },
  { name: "Đơn hàng", href: "/account/orders" },
];

export const infoLinks: NavItem[] = [
  // { name: "All Brands", href: "/brands" },
  { name: "Blog", href: "/blog" },
  // { name: "Pages", href: "/pages" },
  { name: "Thông tin", href: "/about" },
  { name: "Liên hệ", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

export const mobileMenuSections: NavSection[] = [
  { label: "Shop", items: shopLinks },
  { label: "Tài khoản", items: accountLinks },
  { label: "Thông tin", items: infoLinks },
];
