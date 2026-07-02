import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectRules } from "./src/lib/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // CẤP QUYỀN HÌNH ẢNH SUPABASE, PLACEHOLD VÀ UNSPLASH CHO STOREFRONT [21]
  images: {
    dangerouslyAllowSVG: true, // Cho phép hiển thị ảnh SVG từ placehold.co [21]
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amukhgkamrokbbcjgusf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Cho phép hiển thị ảnh setup từ Unsplash [21]
      },
    ],
  },

  // Tối ưu hóa: Loại bỏ console log ở môi trường Production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // GIỮ LẠI CẤU HÌNH FIX HMR / LAN ACCESS CỦA BẠN
  allowedDevOrigins: ["192.168.100.76"],

  // Sử dụng đúng biến redirectRules đã import ở trên
  async redirects() {
    return redirectRules;
  },
};

// ĐỒNG BỘ HÓA BỘ BỌC ĐA NGÔN NGỮ (NEXT-INTL)
export default withNextIntl(nextConfig);
