"use client";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  Heart,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchModal } from "@/components/search/search-modal";
import { cn } from "@/lib/utils";
import { shopLinks, mobileMenuSections } from "@/lib/navigation";
import { siteConfig } from "@/lib/config";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import type { Category } from "@/types";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface HeaderProps {
  /** All categories (top-level + subcategories) from the repository layer */
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const allCategories = categories;
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const openCart = useCartStore((s) => s.openCart);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const itemCount = mounted ? getItemCount() : 0;

  // Trích xuất đường dẫn ảnh đại diện Google từ Auth Store (đã gán kiểu an toàn)
  const userAvatar = (user as any)?.avatar;

  // Phím tắt Cmd+K / Ctrl+K kích hoạt nhanh Modal tìm kiếm AI
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E1DDD5] bg-[#FCFAF2]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FCFAF2]/80">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu Trượt êm ái */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className="inline-flex items-center justify-center rounded-xl p-2 text-[#786F66] hover:bg-[#EAE5D9]/40 hover:text-black lg:hidden cursor-pointer"
              aria-label={t("openMenu")}
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="!w-full !gap-0 sm:!w-80 bg-[#FCFAF2] border-r border-[#E1DDD5] text-[#1E1C1A]"
              showCloseButton={false}
            >
              <div className="shrink-0 px-6 pt-5 pb-2">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-mono font-bold text-[#786F66] hover:text-black uppercase cursor-pointer"
                >
                  &larr; {tCommon("close")}
                </button>
              </div>

              <nav className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 text-left">
                {mobileMenuSections.map((section, sectionIdx) => (
                  <div key={section.label}>
                    {sectionIdx > 0 && (
                      <div className="my-4 border-t border-[#E1DDD5]/60" />
                    )}
                    <p className="mb-2 mt-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#786F66]">
                      {section.label}
                    </p>
                    <div className="ml-3">
                      {section.items.map((item) => {
                        const slug = item.href.replace("/", "");
                        const parentCat = allCategories.find(
                          (c) => c.slug === slug,
                        );
                        const subcats = parentCat
                          ? allCategories.filter(
                              (c) => c.parentId === parentCat.id,
                            )
                          : [];
                        const hasSubcats = subcats.length > 0;
                        const isExpanded = expandedCategory === item.name;

                        return (
                          <div key={item.name}>
                            <div className="flex items-center">
                              <Link
                                href={item.href}
                                className="flex-1 py-2.5 text-sm font-serif font-bold text-black hover:text-[#FF9D00] transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                              {hasSubcats && (
                                <button
                                  onClick={() =>
                                    setExpandedCategory(
                                      isExpanded ? null : item.name,
                                    )
                                  }
                                  className="p-2 text-[#786F66] hover:text-black cursor-pointer"
                                  aria-expanded={isExpanded}
                                >
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 transition-transform",
                                      isExpanded && "rotate-180",
                                    )}
                                  />
                                </button>
                              )}
                            </div>
                            {hasSubcats && isExpanded && (
                              <div className="mb-2 ml-4 flex flex-col border-l border-[#E1DDD5] pl-4">
                                {subcats.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={`/${sub.slug}`}
                                    className="py-2 text-xs font-sans font-medium text-[#786F66] hover:text-black transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* LOGO CHUẨN SERIF DẸT EDITORIAL */}
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-bold tracking-tight uppercase text-black hover:text-[#FF9D00] transition-colors leading-none"
          >
            {siteConfig.name}
          </Link>

          {/* DESKTOP NAV ĐỊNH DẠNG FONT CHỮ KỸ THUẬT MẢNH */}
          <nav className="hidden lg:flex lg:gap-8">
            {shopLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider hover:text-[#FF9D00] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* ACTIONS MENU */}
          <div className="flex items-center gap-1.5 text-black">
            {/* Phím bấm Tìm kiếm */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#EAE5D9]/40 text-[#786F66] hover:text-black transition-colors cursor-pointer"
              aria-label={t("searchProducts")}
            >
              <Search className="h-4.5 w-4.5" />
            </motion.button>

            {/* Phím bấm Yêu thích */}
            <motion.div whileTap={{ scale: 0.95 }} className="hidden lg:block">
              <Link
                href="/wishlist"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#EAE5D9]/40 text-[#786F66] hover:text-black transition-colors"
                aria-label={t("wishlist")}
              >
                <Heart className="h-4.5 w-4.5" />
              </Link>
            </motion.div>

            {/* Tài khoản Dropdown Menu */}
            {mounted && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="hidden h-10 w-10 items-center justify-center rounded-xl hover:bg-[#EAE5D9]/40 transition-colors lg:inline-flex cursor-pointer focus:outline-none"
                  aria-label={t("accountMenu")}
                >
                  {/* TỰ ĐỘNG PHẢN HỒI: Kết xuất ảnh đại diện Google nếu có, ngược lại hiện Monogram chữ cái đầu */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-mono font-bold text-[#FCFAF2] uppercase overflow-hidden border border-[#E1DDD5]">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Google Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (user?.firstName?.[0] ?? "U")
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 rounded-2xl border border-[#E1DDD5] bg-[#FCFAF2] p-2 text-black shadow-lg"
                >
                  <div className="px-3 py-2 text-left">
                    <p className="font-serif text-sm font-bold text-black">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] font-mono text-[#786F66] truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#E1DDD5]/60" />

                  <DropdownMenuItem
                    onClick={() => router.push("/account")}
                    className="rounded-lg font-serif text-xs font-semibold py-2 hover:bg-[#EAE5D9]/30 cursor-pointer"
                  >
                    Bảng điều khiển
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/account/orders")}
                    className="rounded-lg font-serif text-xs font-semibold py-2 hover:bg-[#EAE5D9]/30 cursor-pointer"
                  >
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/account/settings")}
                    className="rounded-lg font-serif text-xs font-semibold py-2 hover:bg-[#EAE5D9]/30 cursor-pointer"
                  >
                    Thiết lập tài khoản
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-[#E1DDD5]/60" />

                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="rounded-lg font-serif text-xs font-bold text-red-600 py-2 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="hidden lg:block"
              >
                <Link
                  href="/auth/login"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#EAE5D9]/40 text-[#786F66] hover:text-black transition-colors"
                  aria-label={tCommon("signIn")}
                >
                  <User className="h-4.5 w-4.5" />
                </Link>
              </motion.div>
            )}

            {/* Giỏ hàng dẹt với bộ số đếm nổi bật */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#EAE5D9]/40 text-[#786F66] hover:text-black transition-colors cursor-pointer"
              aria-label={t("openCart")}
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {itemCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-mono font-bold text-white shadow-sm"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* MODAL TÌM KIẾM AI ĐÃ ĐƯỢC CHUẨN HÓA KHÔNG LỒI BIÊN DỊCH */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
