import { Analytics } from "@vercel/analytics/next";
import { VercelToolbar } from "@vercel/toolbar/next"; // Tích hợp công cụ Vercel Toolbar
import type { Metadata } from "next";
import { Inter, Instrument_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config";
import Script from "next/script";
import "./globals.css";

// Tải phông chữ điều hướng Inter (Satoshi/Inter)
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Tải phông chữ nghệ thuật Instrument Sans
const serif = Instrument_Sans({
  variable: "--font-serif",
  subsets: ["latin"],
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

  // Hiển thị thanh công cụ Vercel Toolbar trong môi trường phát triển hoặc xem trước (Preview)
  const shouldInjectToolbar =
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <head>
        {/* ============================================================================
           GOOGLE TAG MANAGER (NẠP TĨNH TRUYỀN THỐNG TRONG HEAD)
           ============================================================================ */}
        <script
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

      <body
        className="min-h-full flex flex-col bg-background relative"
        suppressHydrationWarning={true}
      >
        {/* ============================================================================
           GOOGLE TAG MANAGER (KỊCH BẢN NOSCRIPT DỰ PHÒNG)
           ============================================================================ */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5555NJ2R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
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

        {/* Đo đạc hiệu năng đám mây Vercel */}
        <Analytics />

        {/* Thanh công cụ Vercel Toolbar */}
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
