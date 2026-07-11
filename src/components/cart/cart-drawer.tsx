"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Loader2, ShieldCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart"; // Đã bổ sung dòng import chuẩn xác
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./cart-item";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client"; // Gọi client Supabase để lấy dữ liệu thực tế [21]
import { motion, AnimatePresence } from "framer-motion";

interface AddonProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const addToCart = useCartStore((s) => s.addItem);

  const [mounted, setMounted] = useState(false);

  // State quản lý danh sách sản phẩm mua thêm động từ Supabase
  const [addons, setAddons] = useState<AddonProduct[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // KÉO DỮ LIỆU GỢI Ý MUA KÈM THỜI GIAN THỰC TỪ SUPABASE KHI MỞ GIỎ HÀNG
  useEffect(() => {
    if (!mounted || !isOpen) return;

    async function fetchDrawerAddons() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, images")
          .eq("published", true)
          .limit(3);

        if (!error && data) {
          const mapped: AddonProduct[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            price: Number(item.price ?? 0) * 100, // Nhân 100 để triệt tiêu formatPrice
            images: item.images || [],
          }));
          setAddons(mapped);
        }
      } catch (err) {
        console.error("Lỗi nạp sản phẩm mua kèm ở Drawer:", err);
      } finally {
        setAddonsLoading(false);
      }
    }

    fetchDrawerAddons();
  }, [mounted, isOpen]);

  // Thêm nhanh sản phẩm gợi ý vào giỏ hàng dứt khoát
  function handleAddAddonToCart(addon: AddonProduct) {
    const itemInCart = items.find((i) => i.productId === addon.id);
    if (itemInCart) {
      toast("Sản phẩm này đã nằm trong giỏ hàng của bạn rồi ✨");
      return;
    }

    addToCart({
      variantId: addon.id + "-default",
      productId: addon.id,
      name: addon.name,
      variantName: "Default Variant",
      image: { url: addon.images[0] || "", alt: addon.name },
      slug: addon.slug,
      price: addon.price,
      quantity: 1,
    });
    toast.success(`Đã thêm ${addon.name} vào giỏ hàng!`);
  }

  if (!mounted) return null;

  const subtotal = getSubtotal();

  // Lọc sạch sản phẩm gợi ý: Không hiển thị sản phẩm đã nằm sẵn trong giỏ của khách
  const cartProductIds = new Set(items.map((i) => i.productId));
  const filteredAddons = addons.filter((a) => !cartProductIds.has(a.id));

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#FCFAF2] border-l border-[#E1DDD5] p-0 flex flex-col h-full text-[#1E1C1A] selection:bg-[#EAE5D9] select-none"
        showCloseButton={false}
      >
        {/* HEADER GIỎ HÀNG DẸT COZY */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E1DDD5]/60 bg-white/40">
          <SheetTitle className="font-serif text-lg font-bold text-black">
            Giỏ hàng ({items.reduce((sum, item) => sum + item.quantity, 0)} sản
            phẩm)
          </SheetTitle>
          <button
            onClick={closeCart}
            className="rounded-md p-1.5 text-[#786F66] hover:bg-[#EAE5D9]/40 hover:text-black transition-all cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* CONTAINER NỘI DUNG CHÍNH (SỬ DỤNG SCROLL THỜI TRANG) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-[#EAE5D9]">
          {/* TRẠNG THÁI 1: GIỎ HÀNG ĐANG CÓ SẢN PHẨM */}
          {items.length > 0 ? (
            <div className="divide-y divide-[#E1DDD5]/60">
              {items.map((item) => (
                <CartItem key={item.variantId} item={item} />
              ))}
            </div>
          ) : (
            /* TRẠNG THÁI 2: GIỎ HÀNG ĐANG TRỐNG */
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="rounded-2xl bg-[#EAE5D9]/20 p-5 border border-[#E1DDD5]/40 text-[#786F66]">
                <ShoppingBag className="h-8 w-8 stroke-[1.25]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-base font-bold text-black">
                  Giỏ hàng của bạn đang trống
                </h3>
                <p className="text-xs text-[#786F66] font-sans">
                  Bỏ vài món vào giỏ đi rồi bắt đầu mua sắm thôi 😎🛒
                </p>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full bg-black hover:bg-[#33302C] text-[10px] font-mono font-bold tracking-widest text-white px-6 py-2.5 uppercase transition-colors cursor-pointer shadow-sm"
              >
                Đi mua tiếp thôi 🚀
              </button>
            </div>
          )}

          {/* ============================================================================
             NÂNG CẤP ĐỘT PHÁ: COMPLETE YOUR SETUP (GỢI Ý MUA KÈM CHUẨN ĐẸP ẢNH 2 CỦA DAYLIGHT)
             Hiển thị ngay cả khi giỏ hàng trống để tối ưu tỉ lệ chuyển đổi
             ============================================================================ */}
          {filteredAddons.length > 0 && (
            <div className="bg-white border border-[#E1DDD5] rounded-3xl p-5 space-y-4 shadow-sm text-left">
              <div className="space-y-0.5 border-b border-[#E1DDD5]/40 pb-2">
                <h4 className="font-serif text-sm font-bold text-black">
                  Complete your Setup
                </h4>
                <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                  Hoàn thiện không gian mộc mạc
                </p>
              </div>

              {addonsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-[#FF9D00]" />
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredAddons.slice(0, 3).map((addon) => {
                    const imgUrl = addon.images[0] || PLACEHOLDER_IMAGE;
                    return (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FCFAF2]/50 border border-[#E1DDD5]/60 hover:border-black/5 transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Thumbnail */}
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-inner">
                            <Image
                              src={imgUrl}
                              alt={addon.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          {/* Title & Price */}
                          <div className="text-left space-y-0.5 min-w-0">
                            <h5 className="font-serif text-xs font-bold text-black truncate max-w-[130px] sm:max-w-none">
                              {addon.name}
                            </h5>
                            <p className="font-mono text-[10px] text-[#786F66] font-semibold">
                              {formatPrice(addon.price)}
                            </p>
                          </div>
                        </div>

                        {/* Phím bấm ADD + dẹt mộc mạc độc quyền của Daylight */}
                        <button
                          onClick={() => handleAddAddonToCart(addon)}
                          className="rounded-lg bg-black hover:bg-[#33302C] text-[9px] font-mono font-bold tracking-widest text-white px-3 py-2 uppercase shadow-sm shrink-0 cursor-pointer transition-colors"
                        >
                          ADD +
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==========================================
           FOOTER GIỎ HÀNG: THANH TOÁN & CAM KẾT (DỌN SẠCH CHÌM MÀU)
           ========================================== */}
        <div className="p-6 bg-white border-t border-[#E1DDD5] space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          {items.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-baseline text-left">
                <span className="font-serif text-sm font-semibold text-[#5c544d]">
                  Tạm tính:
                </span>
                <span className="font-mono text-base font-bold text-black">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#3ECF8E] uppercase tracking-wider font-bold text-left">
                ✓ Miễn phí vận chuyển toàn quốc tại Việt Nam
              </p>

              {/* Phím bấm Tiến hành thanh toán dẹt tròn lớn */}
              <Button
                asChild
                size="lg"
                onClick={closeCart}
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-all shadow-sm"
              >
                <Link href="/checkout">Tiến hành thanh toán</Link>
              </Button>
            </div>
          )}

          {/* DẢI CAM KẾT DƯỚI ĐÁY CHUẨN HÃNG VỚI ĐƯỜNG KẺ CHẤM BI (DOTTED) */}
          <div className="pt-2 border-t border-dashed border-[#E1DDD5] grid grid-cols-2 gap-4 text-left text-[10px] text-[#786F66]">
            <div className="space-y-1">
              <span className="font-semibold text-black flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#3ECF8E]" /> Secure
                Payments
              </span>
              <p className="leading-tight scale-90 origin-left text-neutral-400">
                Thanh toán bảo mật.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-black flex items-center gap-1">
                <RotateCcw className="h-3 w-3 text-[#3ECF8E]" /> 30-Day
                Guarantee
              </span>
              <p className="leading-tight scale-90 origin-left text-neutral-400">
                Đổi trả bảo hành dễ dàng trong 30 ngày.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
