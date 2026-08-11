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

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amukhgkamrokbbcjgusf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      // KHAI BÁO TÊN MIỀN HÌNH ẢNH GOOGLE AVATAR VÀ CÁC NGUỒN NGOẠI
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  allowedDevOrigins: ["192.168.100.76"],

  async redirects() {
    return redirectRules;
  },
};

export default withNextIntl(withToolbar(nextConfig));
