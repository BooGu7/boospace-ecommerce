import withVercelToolbar from "@vercel/toolbar/plugins/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectRules } from "./src/lib/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withToolbar = withVercelToolbar();

const nextConfig: NextConfig = {
  experimental: {
    cpus: 4,
  },

  // NGĂN CHẶN LỖI TURBOPACK BUNDLING CHO CÁC THƯ VIỆN BACKEND
  serverExternalPackages: ["@payos/node", "bcryptjs"],

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      // 1. SUPABASE STORAGE (HÌNH ẢNH & FILE CHẾ TÁC 3D)
      {
        protocol: "https",
        hostname: "amukhgkamrokbbcjgusf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },

      // 2. GOOGLE AVATAR (HỖ TRỢ MỌI SUBDOMAIN LH1 -> LH6)
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },

      // 3. ẢNH MẪU & CDN NGOẠI
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // 4. MÃ QR VIETQR & CỔNG THANH TOÁN PAYOS
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
      {
        protocol: "https",
        hostname: "**.payos.vn",
      },
    ],
  },

  compiler: {
    // Xóa log debug nhưng giữ lại console.error và console.warn để theo dõi thanh toán
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  allowedDevOrigins: ["192.168.100.76", "localhost:3000"],

  async redirects() {
    return redirectRules;
  },
};

export default withNextIntl(withToolbar(nextConfig));
