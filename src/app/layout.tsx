import { Analytics } from "@vercel/analytics/next"; // Đo đạc Web Vitals của Vercel
import type { Metadata } from "next";
import { Inter, Instrument_Sans } from "next/font/google"; // 2 phông chữ chuẩn Bio-Tech Zen
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config";
import Script from "next/script"; // Thư viện Script tối ưu của Next.js [1.1]
import "./globals.css";

// 1. Tải phông chữ điều hướng Inter (Satoshi/Inter)
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// 2. Tải phông chữ nghệ thuật Instrument Sans (Đã loại bỏ phân vùng "vietnamese" gây lỗi)
const serif = Instrument_Sans({
  variable: "--font-serif",
  subsets: ["latin"], // Đã sửa lỗi kiểu tĩnh an toàn [2]
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale.replace("-", "_"),
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning // Dập tắt cảnh báo lệch dữ liệu do Extension trình duyệt
      className={`${sans.variable} ${serif.variable} h-full antialiased`} // Ánh xạ 2 biến phông
    >
      <head>
        {/* ============================================================================
           GOOGLE TAG MANAGER (KỊCH BẢN CHÍNH - TỐI ƯU HOÁ HIỆU NĂNG QUA NEXT/SCRIPT) [1.1]
           ============================================================================ */}
        <Script
          id="gtm-script"
          strategy="afterInteractive" // Chỉ nạp sau khi trang đã tương tác xong, bảo vệ tốc độ tải trang
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5555NJ2R');
            `,
          }}
        />
      </head>

      {/* Đồng bộ màu ngà cát mộc mạc bg-background cho body */}
      <body className="min-h-full flex flex-col bg-background relative">
        {/* ============================================================================
           GOOGLE TAG MANAGER (KỊCH BẢN NOSCRIPT DỰ PHÒNG - ĐẶT NGAY SAU KHI MỞ BODY) [1.1]
           ============================================================================ */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5555NJ2R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }} // Chuyển đổi chuẩn cú pháp JSX
          />
        </noscript>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        {/* Hộp thông báo nổi */}
        <Toaster position="bottom-right" />

        {/* Đo đạc hiệu năng đám mây */}
        <Analytics />
      </body>
    </html>
  );
}
