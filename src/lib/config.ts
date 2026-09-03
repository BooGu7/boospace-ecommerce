// ============================================================================
// Store Configuration — Single source of truth cho Boo Space Studio
// ============================================================================

export const siteConfig = {
  // Branding
  name: "Boo Space",
  tagline: "STUDIO THIẾT KẾ VẬT THỂ & KHÔNG GIAN SỐNG CÓ CẢM XÚC.",
  slogan: "Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay hôm nay.",

  description:
    "Boo Space tạo ra những vật thể thiết kế cho không gian sống có cảm xúc. Kết hợp cảm hứng thiên nhiên, sự ấm áp tối giản và chế tác tỉ mỉ mang lại sự bình yên cho ngôi nhà bạn.",

  announcement:
    "Chào mừng bạn đến với Boo Space — Những vật thể nhỏ cho không gian sống có cảm xúc ✨",

  url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.boospace.tech",

  // 📞 THÔNG TIN LIÊN HỆ ĐỒNG BỘ TOÀN HỆ THỐNG
  contact: {
    email: "support@boospace.tech",
    supportEmail: "support@boospace.tech",
    phone: "0972.306.562",
    hotline: "0972.306.562",
    workingHours: "08:00 – 18:00 (Thứ Hai – Thứ Bảy)",
    address: {
      street: "19/16 Lam Sơn, Phường Đức Nhuận",
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
