"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Đã bổ sung dòng import chuẩn xác
import { ShoppingBag, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartStore } from "@/store/cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client"; // Gọi client Supabase để lấy dữ liệu thực tế [21]
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

interface AddonProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [mounted, setMounted] = useState(false);

  // State quản lý danh sách sản phẩm mua thêm động từ Supabase
  const [addons, setAddons] = useState<AddonProduct[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // KÉO DỮ LIỆU SẢN PHẨM HOẠT ĐỘNG TỪ SUPABASE ĐỂ LÀM MODULE MUA KÈM (UPSELL)
  useEffect(() => {
    if (!mounted) return;

    async function fetchAddons() {
      try {
        // Lấy 3 sản phẩm đang được xuất bản để gợi ý mua kèm dưới gầm giỏ hàng [21]
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
            price: Number(item.price ?? 0) * 100, // Nhân 100 để triệt tiêu formatPrice chia 100
            images: item.images || [],
          }));
          setAddons(mapped);
        }
      } catch (err) {
        console.error("Lỗi nạp sản phẩm mua kèm:", err);
      } finally {
        setAddonsLoading(false);
      }
    }

    fetchAddons();
  }, [mounted]);

  // Hàm thêm nhanh sản phẩm gợi ý vào giỏ hàng dứt khoát
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

  if (!mounted) {
    return (
      <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#FF9D00]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
          <PageHeader title="Giỏ hàng" />
          <EmptyState
            icon={ShoppingBag}
            title="Giỏ hàng của bạn đang trống"
            description="Có vẻ như bạn chưa thêm thiết kế nào vào giỏ hàng của mình."
            actionLabel="Tiếp tục mua sắm"
            actionHref="/shop"
          />
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();

  // Lọc bỏ các sản phẩm đã có sẵn trong giỏ hàng khỏi mục Gợi ý mua kèm
  const cartProductIds = new Set(items.map((i) => i.productId));
  const filteredAddons = addons.filter((a) => !cartProductIds.has(a.id));

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-3xl px-4 py-8 pb-16 sm:px-6 sm:py-16 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50 text-left">
        {/* HEADER GIỎ HÀNG */}
        <div className="border-b border-[#E1DDD5] pb-6 mb-8 flex flex-col text-left space-y-2">
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
            08 / SHOPPING BAG
          </span>
          <h1 className="font-serif text-3xl font-bold text-black">
            Giỏ hàng của bạn
          </h1>
        </div>

        {/* DANH SÁCH GIỎ HÀNG */}
        <div className="space-y-1">
          <div className="divide-y divide-[#E1DDD5]/60 border-b border-[#E1DDD5]/60">
            {items.map((item) => (
              <CartItem key={item.variantId} item={item} />
            ))}
          </div>

          <Separator className="bg-[#E1DDD5]/60 my-6" />
          <CartSummary subtotal={subtotal} />

          {/* ==========================================
             NÂNG CẤP: BẢNG SẢN PHẨM GỢI Ý MUA KÈM (GIỐNG HỆT ẢNH 2 CỦA DAYLIGHT)
             ========================================== */}
          {filteredAddons.length > 0 && (
            <div className="mt-12 bg-white border border-[#E1DDD5] rounded-3xl p-6 space-y-5">
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-black">
                  Complete your Setup
                </h4>
                <p className="text-xs text-[#786F66] leading-none">
                  Hoàn thiện không gian bằng các sản phẩm đi kèm.
                </p>
              </div>

              {addonsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-[#FF9D00]" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAddons.slice(0, 3).map((addon) => {
                    const imgUrl = addon.images[0] || PLACEHOLDER_IMAGE;
                    return (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF2]/40 border border-[#E1DDD5]/60 hover:border-black/10 transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Thumbnail */}
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-inner">
                            <Image
                              src={imgUrl}
                              alt={addon.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          {/* Title & Price */}
                          <div className="text-left space-y-0.5">
                            <h5 className="font-serif text-sm font-bold text-black truncate max-w-[200px] sm:max-w-none">
                              {addon.name}
                            </h5>
                            <p className="font-mono text-xs text-[#786F66] font-semibold">
                              {formatPrice(addon.price)}
                            </p>
                          </div>
                        </div>

                        {/* Phím bấm ADD + dẹt mộc mạc cao cấp của Daylight */}
                        <button
                          onClick={() => handleAddAddonToCart(addon)}
                          className="rounded-lg bg-black hover:bg-[#33302C] text-[10px] font-mono font-bold tracking-widest text-white px-4 py-2.5 uppercase shadow-sm shrink-0 cursor-pointer transition-colors"
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

          {/* Các nút bấm dẹt lớn thao tác thanh toán */}
          <div className="mt-8 flex flex-col gap-3 pt-6">
            <Button
              size="lg"
              className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors shadow-sm"
              asChild
            >
              <Link href="/checkout">Tiến hành thanh toán</Link>
            </Button>

            <Button
              variant="outline"
              className="w-full border-[#E1DDD5] bg-white hover:bg-[#EAE5D9]/30 text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors"
              asChild
            >
              <Link href="/shop">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
