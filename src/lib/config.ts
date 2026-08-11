// ============================================================================
// Store Configuration — Single source of truth cho Boo Space
// ============================================================================

export const siteConfig = {
  // Branding
  name: "Boo Space",
  tagline: "STUDIO HIỆN THỰC HÓA Ý TƯỞNG & MAY ĐO GÓC LÀM VIỆC THEO YÊU CẦU.",
  slogan: "Mang sự tĩnh lặng và ấm áp về căn phòng của bạn ngay hôm nay.",

  description:
    "Boo Space là studio thiết kế và chế tác các giải pháp tinh gọn, đa năng, minimal và cozy dành riêng cho góc làm việc của bạn. Chúng tôi hiện thực hóa mọi ý tưởng cá nhân, giải quyết những bất tiện hằng ngày bằng chất liệu kỹ thuật cao cấp.",

  announcement: "Chào mừng bạn đến với Boo Space — Nơi biến mọi ý tưởng cá nhân thành sản phẩm thực tế ✨",

  url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.boospace.tech",

  // Thông tin liên hệ
  contact: {
    email: "hello@boospace.tech",
    phone: "0901 234 567",
    address: {
      street: "",
      suite: "",
      city: "TP. Hồ Chí Minh",
      state: "Hồ Chí Minh",
      zip: "700000",
    },
  },

  // Mạng xã hội
  social: {
    twitter: "",
    instagram: "https://www.instagram.com/boospacestudio",
    facebook: "https://www.facebook.com/boospace7",
    youtube: "",
    tiktok: "https://www.tiktok.com/@boo.space",
  },

  // BỔ SUNG CẢ THUỘC TÍNH MỚI VÀ CŨ ĐỂ TƯƠNG THÍCH 100% VỚI CART SUMMARY
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
