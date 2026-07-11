import type { MetadataRoute } from "next";

// Khôi phục tên miền chính thức dự phòng
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://www.boospace.tech";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/", "/checkout/", "/api/"], // Ngăn chặn bot dò quét các vùng nhạy cảm
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Gọi sơ đồ trang theo tên miền chính thức của bạn
  };
}
