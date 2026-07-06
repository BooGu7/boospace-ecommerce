// ============================================================================
// Store Configuration — Single source of truth for all store-wide settings.
// Edit this file to customize the store name, contact info, social links, etc.
// ============================================================================

export const siteConfig = {
  // Branding
  name: "Boo Space",

  tagline:
    "BOO SPACE — STUDIO HIỆN THỰC HÓA Ý TƯỞNG & MAY ĐO GÓC LÀM VIỆC THEO YÊU CẦU.",
  // Gợi ý: Đổi "không gian" thành "góc làm việc" giúp định vị rõ ràng hơn về mảng workspace, tạo cảm giác cá nhân hóa sâu sắc.

  description:
    "Boo Space là studio thiết kế và chế tác các sản phẩm custom tiện ích dành riêng cho góc làm việc của bạn. Chúng tôi hiện thực hóa mọi ý tưởng cá nhân, giải quyết những bất tiện hằng ngày và nâng tầm không gian sống bằng các giải pháp thông minh được đo ni đóng giày cho chính bạn.",
  // Đã sửa: Bỏ bớt từ "in 3D" bị lặp lại nhiều lần, tập trung vào giá trị "giải quyết bất tiện" và "chế tác custom" đúng theo gu của bạn ở các câu trước.

  // Announcement bar (set to "" to hide)
  announcement:
    "Chào mừng bạn đến với Boo Space — Nơi biến mọi ý tưởng cá nhân thành sản phẩm thực tế ✨",
  // Đã sửa: Đồng bộ với concept "biến ý tưởng thành thực tế cầm trên tay".
  // URLs
  url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  // Contact Information [21]
  contact: {
    email: "boospace7@gmail.com",
    phone: "",
    address: {
      street: "",
      suite: "",
      city: "Hồ Chí Minh",
      state: "Hồ Chí Minh",
      zip: "700000",
    },
  },

  // Social links (set to "" to hide)
  social: {
    twitter: "",
    instagram: "https://www.instagram.com/boospacestudio",
    facebook: "https://www.facebook.com/boospace7",
    youtube: "",
    tiktok: "https://www.tiktok.com/@boo.space",
  },

  // Shipping Configuration
  freeShippingThreshold: 500000, // Đơn hàng từ 500.000₫ trở lên được miễn phí vận chuyển
  taxRate: 0.0, // Không áp dụng thuế cố định hiển thị ở frontend

  // Currency & locale
  currency: "VND",
  locale: "vi-VN",

  // Legal
  copyrightYear: new Date().getFullYear(),
} as const;

export type SiteConfig = typeof siteConfig;
