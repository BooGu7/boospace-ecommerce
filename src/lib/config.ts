// ============================================================================
// Store Configuration — Single source of truth for all store-wide settings.
// Edit this file to customize the store name, contact info, social links, etc.
// ============================================================================

export const siteConfig = {
  // Branding
  name: "Boo Space",
  tagline:
    "BooSpace — Studio thiết kế DIY & không gian làm việc in 3D theo yêu cầu",

  description:
    "Boo Space là cửa hàng sản phẩm in 3D theo yêu cầu dành cho workspace và DIY. Thiết kế tùy chỉnh, sản xuất theo ý tưởng riêng và biến mọi không gian làm việc trở nên độc đáo bằng công nghệ in 3D.",

  // Announcement bar (set to "" to hide)
  announcement:
    "Chào mừng bạn đến với Boo Space — nơi biến ý tưởng của bạn thành hiện thực ✨",
  // URLs
  url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  // Contact
  contact: {
    email: "boospace7@gmail.com",
    phone: "",
    address: {
      street: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
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

  // Shipping
  freeShippingThreshold: 0, // in VND (~200,000₫, tuỳ bạn chỉnh)
  taxRate: 0.0, // Việt Nam thường không set tax cố định trong frontend ecommerce nhỏ

  // Currency & locale
  currency: "VND",
  locale: "vi-VN",

  // Legal
  copyrightYear: new Date().getFullYear(),
} as const;

export type SiteConfig = typeof siteConfig;
