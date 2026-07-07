"use client";

import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";
import { toast } from "sonner";

// ICONS GIỮ NGUYÊN SVG GỐC
function IconTwitter({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconYouTube({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const footerLinks = {
  shop: [
    { name: "Tất cả sản phẩm", href: "/shop" },
    { name: "Sản phẩm mới", href: "/shop?sort=newest" },
    { name: "Khuyến mãi", href: "/shop?sale=true" },
  ],
  company: [
    { name: "Giới thiệu", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Liên hệ", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Chính sách vận chuyển", href: "/policies/shipping" },
    { name: "Đổi trả & hoàn tiền", href: "/policies/returns" },
    { name: "Chính sách bảo mật", href: "/policies/privacy" },
    { name: "Điều khoản sử dụng", href: "/policies/terms" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Tiến trình đăng ký nhận bản tin gửi dữ liệu trực tiếp về Supabase
  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Đăng ký nhận tin thành công! ✨");
        setEmail("");
      } else {
        toast.error(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="relative z-10 border-t border-[#E1DDD5] bg-[#FCFAF2] text-[#1E1C1A]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5]">
        {/* KHU VỰC TRÊN: BRAND & LINKS */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 pb-16">
          <div className="col-span-2 space-y-4">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight uppercase leading-none text-black hover:text-[#FF9D00] transition-colors"
            >
              {siteConfig.name}
            </Link>
            <p className="text-xs font-mono text-[#786F66]/85 max-w-sm leading-relaxed text-left">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Shop */}
          <div className="text-left">
            <h3 className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 font-serif text-sm font-medium">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#FF9D00]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="text-left">
            <h3 className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
              Thông tin
            </h3>
            <ul className="mt-4 space-y-2.5 font-serif text-sm font-medium">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#FF9D00]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="text-left">
            <h3 className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
              Pháp lý
            </h3>
            <ul className="mt-4 space-y-2.5 font-serif text-sm font-medium">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#FF9D00]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* KHU VỰC GIỮA: GET UPDATES EMAIL (PILL-IN-PILL LỒNG DẸT CHUẨN ĐỒNG BỘ) */}
        <div className="border-t border-[#E1DDD5]/80 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h4 className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-semibold">
              Get updates
            </h4>
            <p className="text-xs text-[#786F66]/80 font-sans">
              Đăng ký để nhận tin tức về sản phẩm thủ công, thiết kế workspace
              mới nhất.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="relative w-full max-w-sm flex items-center bg-transparent border border-[#E1DDD5] rounded-full p-1 focus-within:ring-1 focus-within:ring-[#FF9D00]"
          >
            <input
              type="email"
              placeholder="E-MAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent px-5 py-2 text-xs font-mono tracking-wider outline-none text-black placeholder:text-[#786F66]/50"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-white hover:bg-neutral-100 text-[10px] font-mono font-bold tracking-widest text-black border border-[#E1DDD5] px-5 py-2.5 uppercase shadow-sm transition-all shrink-0 cursor-pointer"
            >
              {submitting ? "..." : "ĐĂNG KÝ NHẬN THÔNG TIN"}
            </button>
          </form>
        </div>

        <Separator className="bg-[#E1DDD5]/60 my-6" />

        {/* KHU VỰC DƯỚI: COPYRIGHT */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
          <p className="text-[10px] font-mono text-[#786F66]/80 leading-relaxed">
            &copy; {siteConfig.copyrightYear} {siteConfig.name}. Operating under
            the ethos of deep focus and offline-first tranquility.
            <br className="sm:hidden" />
          </p>
          <div className="flex items-center gap-5 text-[#786F66]">
            <a
              href="#"
              className="transition-colors hover:text-black"
              aria-label="Twitter"
            >
              <IconTwitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="transition-colors hover:text-black"
              aria-label="Instagram"
            >
              <IconInstagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="transition-colors hover:text-black"
              aria-label="Facebook"
            >
              <IconFacebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="transition-colors hover:text-black"
              aria-label="YouTube"
            >
              <IconYouTube className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="transition-colors hover:text-black"
              aria-label="TikTok"
            >
              <IconTikTok className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
