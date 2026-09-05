// ============================================================================
// Store Configuration — Single source of truth cho Boo Space Studio
// ============================================================================

const rawDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "boospace.tech";
const rawBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  `https://www.${rawDomain}`;
const rawAdminUrl =
  process.env.NEXT_PUBLIC_ADMIN_URL || `https://admin.${rawDomain}`;

export const siteConfig = {
  // 🌐 CẤU HÌNH TÊN MIỀN TẬP TRUNG (Dễ dàng thay đổi trong tương lai)
  domain: rawDomain,
  url: rawBaseUrl,
  adminUrl: rawAdminUrl,

  // Branding
  name: "Boo Space",
  tagline: "STUDIO CHẾ TÁC & THIẾT KẾ KHÔNG GIAN SỐNG CÓ CẢM XÚC.",
  slogan: "Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay hôm nay.",

  description:
    "Boo Space tạo ra những tác phẩm thiết kế cho không gian sống có cảm xúc. Kết hợp cảm hứng thiên nhiên, sự ấm áp tối giản và chế tác tỉ mỉ mang lại sự bình yên cho ngôi nhà bạn.",

  announcement:
    "Chào mừng bạn đến với Boo Space — Những thiết kế tinh tế cho không gian sống có cảm xúc ✨",

  // 📞 THÔNG TIN LIÊN HỆ ĐỒNG BỘ TOÀN HỆ THỐNG
  contact: {
    email: `support@${rawDomain}`,
    supportEmail: `support@${rawDomain}`,
    phone: "0972.306.562",
    hotline: "0972.306.562",
    workingHours: "08:00 – 18:00 (Thứ Hai – Thứ Bảy)",
    address: {
      street: "Đường Lam Sơn, Phường Đức Nhuận",
      suite: "",
      city: "Thành phố Thủ Đức, TP. Hồ Chí Minh",
      state: "Hồ Chí Minh",
      zip: "700000",
    },
  },

  // 🌐 MẠNG XÃ HỘI & KÊNH LIÊN HỆ
  social: {
    zalo: "https://zalo.me/0972306562",
    instagram: "https://www.instagram.com/boospacestudio",
    facebook: "https://www.facebook.com/boospace7",
    tiktok: "https://www.tiktok.com/@boo.space",
    youtube: "https://www.youtube.com/@boospace",
    twitter: "",
  },

  // CHÍNH SÁCH VẬN CHUYỂN
  freeShippingThreshold: 500000, // Miễn phí vận chuyển cho đơn từ 500.000đ
  taxRate: 0.0, // Thuế cố định
  shipping: {
    freeCityKeyword: "Hồ Chí Minh",
    standardFee: 30000,
  },

  currency: "VND",
  locale: "vi-VN",
  copyrightYear: new Date().getFullYear(),
} as const;

export type SiteConfig = typeof siteConfig;
