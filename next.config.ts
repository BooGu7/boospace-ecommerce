import withVercelToolbar from "@vercel/toolbar/plugins/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectRules } from "./src/lib/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withToolbar = withVercelToolbar();

const nextConfig: NextConfig = {
  // GIỚI HẠN 1 WORKER ĐỂ TIẾT KIỆM RAM TRÊN VERCEL
  experimental: {
    cpus: 1,
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
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
