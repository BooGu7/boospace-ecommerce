import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  const isDev = process.env.NODE_ENV !== "production";

  // ĐÃ SỬA: Bổ sung media-src và cấp quyền tải video từ Supabase Storage
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https://amukhgkamrokbbcjgusf.supabase.co https:",
    "font-src 'self' https://fonts.gstatic.com https:",
    "connect-src 'self' https: wss: https://*.supabase.co https://api-merchant.payos.vn",
    "frame-ancestors 'none'",
  ].join("; ");

  if (isDev) {
    response.headers.set("Content-Security-Policy-Report-Only", csp);
  } else {
    response.headers.set("Content-Security-Policy", csp);
  }

  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
