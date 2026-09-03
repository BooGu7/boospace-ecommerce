"use client";

import {
  ArrowRight,
  HelpCircle,
  Loader2,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart";

interface AddonProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  compare_price?: number;
}

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addToCart = useCartStore((s) => s.addItem);

  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [applying, setApplying] = useState(false);

  const [addons, setAddons] = useState<AddonProduct[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    async function fetchCartAddons() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, images, compare_price")
          .eq("published", true)
          .limit(3);

        if (!error && data) {
          setAddons(data as AddonProduct[]);
        }
      } catch (err) {
        console.error("Lỗi nạp sản phẩm gợi ý:", err);
      } finally {
        setAddonsLoading(false);
      }
    }
    fetchCartAddons();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center">
        <Loader2 className="size-6 text-[#FF9D00] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <ShoppingBag className="size-16 text-[#786F66] mx-auto stroke-[1.25]" />
          <h1 className="font-serif text-3xl font-bold text-black">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-xs font-sans text-[#786F66]">
            Hãy khám phá các thiết kế chế tác mộc mạc và hoàn thiện không gian sống
            của bạn nhé ✨
          </p>
          <Button
            asChild
            className="rounded-xl bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs font-bold tracking-wider py-4 px-8 cursor-pointer"
          >
            <Link href="/shop">Bắt đầu mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("active", true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setDiscountPercent(data.discount_percent);
        setAppliedCoupon(data.code);
        toast.success(
          `Áp dụng mã ${data.code} giảm ${data.discount_percent}% thành công! ✨`,
        );
      } else {
        toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi trong quá trình xác thực mã.");
    } finally {
      setApplying(false);
    }
  }

  function handleAddAddonToCart(addon: AddonProduct) {
    const itemInCart = items.find((i) => i.productId === addon.id);
    if (itemInCart) {
      toast("Sản phẩm này đã có trong giỏ hàng của bạn ✨");
      return;
    }

    addToCart({
      variantId: `${addon.id}-default`,
      productId: addon.id,
      name: addon.name,
      variantName: "Default Variant",
      image: { url: addon.images?.[0] || "", alt: addon.name },
      slug: addon.slug,
      price: addon.price * 100,
      quantity: 1,
    });
    toast.success(`Đã thêm ${addon.name} vào giỏ hàng!`);
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  const checkoutProductIds = new Set(items.map((i) => i.productId));
  const filteredAddons = addons.filter((a) => !checkoutProductIds.has(a.id));

  return (
    <div className="bg-[#FCFAF2] min-h-screen text-[#1E1C1A] antialiased">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black border-b border-[#E1DDD5] pb-6 text-left">
          Giỏ hàng của bạn ({items.reduce((a, b) => a + b.quantity, 0)} sản
          phẩm)
        </h1>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs space-y-6">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/60">
                <CardTitle className="font-serif text-lg font-bold text-black">
                  Sản phẩm đã chọn
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-[#E1DDD5]/60">
                {items.map((item) => {
                  const imgUrl = item.image?.url || PLACEHOLDER_IMAGE;
                  const unitPrice = item.price / 100;
                  const lineTotal = item.lineTotal / 100;

                  return (
                    <div
                      key={item.variantId}
                      className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-xs">
                        <Image
                          src={imgUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-black truncate leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs font-mono text-[#786F66]">
                          Đơn giá:{" "}
                          <strong className="text-black">
                            {formatVND(unitPrice)}
                          </strong>
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center border border-[#CFCABF] rounded-lg bg-[#FCFAF2] overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.variantId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              className="px-2.5 py-1 text-xs font-mono font-bold hover:bg-[#EAE5D9]/50 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-mono font-bold text-black">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.variantId,
                                  item.quantity + 1,
                                )
                              }
                              className="px-2.5 py-1 text-xs font-mono font-bold hover:bg-[#EAE5D9]/50 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              removeItem(item.variantId);
                              toast.success(`Đã xóa ${item.name}`);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="size-3.5" /> Xóa
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm sm:text-base font-bold text-black">
                          {formatVND(lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* UPSELL MUA KÈM CÓ NÚT THÊM */}
            {filteredAddons.length > 0 && (
              <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs space-y-4">
                <CardHeader className="p-0 pb-3 border-b border-[#E1DDD5]/60">
                  <CardTitle className="font-serif text-base font-bold text-black">
                    Hoàn thiện không gian mộc mạc (Complete your Setup)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {addonsLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="size-5 animate-spin text-[#FF9D00]" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAddons.slice(0, 2).map((addon) => {
                        const addonImg = addon.images?.[0] || PLACEHOLDER_IMAGE;
                        return (
                          <div
                            key={addon.id}
                            className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#FCFAF2]/60 border border-[#E1DDD5]"
                          >
                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-white">
                                <Image
                                  src={addonImg}
                                  alt={addon.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-serif text-xs font-bold text-black truncate">
                                  {addon.name}
                                </h4>
                                <span className="font-mono text-xs font-bold text-amber-600">
                                  {formatVND(addon.price)}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddAddonToCart(addon)}
                              className="rounded-lg bg-black hover:bg-[#33302C] text-[10px] font-sans font-bold text-white px-3.5 py-2 uppercase cursor-pointer transition-colors"
                            >
                              Thêm
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-5">
            <Card className="sticky top-24 rounded-3xl border border-[#DCD6CC] bg-[#FAF5F2]/90 p-6 shadow-md space-y-6">
              <CardHeader className="p-0 pb-3 border-b border-[#E1DDD5]/60">
                <CardTitle className="font-serif text-lg font-bold text-black">
                  Tóm tắt giỏ hàng
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Mã giảm giá (ví dụ: BOOSPACE)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 h-11 rounded-lg border border-[#CFCABF] bg-white px-4 text-xs font-sans text-black focus:border-[#FF9D00]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applying || !couponCode.trim()}
                    className="rounded-lg bg-[#EAE5D9]/40 border border-[#CFCABF] text-black font-mono uppercase text-[10px] font-bold tracking-wider px-5 py-3 cursor-pointer hover:bg-white disabled:opacity-50 transition-colors"
                  >
                    {applying ? (
                      <Loader2 className="size-3 animate-spin text-black" />
                    ) : (
                      "Áp dụng"
                    )}
                  </button>
                </div>

                <Separator className="bg-[#E1DDD5]" />

                <div className="space-y-3.5 text-xs font-sans">
                  <div className="flex justify-between text-[#5c544d]">
                    <span>Tổng tạm tính</span>
                    <span className="font-mono font-medium text-black">
                      {formatVND(subtotal / 100)}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-[#E26E67] font-medium">
                      <span>
                        Giảm giá ({appliedCoupon} - {discountPercent}%)
                      </span>
                      <span className="font-mono font-bold">
                        -{formatVND(discountAmount / 100)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#5c544d]">
                    <span className="flex items-center gap-1.5">
                      Phí vận chuyển
                      <HelpCircle className="h-3.5 w-3.5 text-[#786F66] cursor-help" />
                    </span>
                    <span className="font-mono font-bold text-[#3ECF8E] tracking-wider text-[11px]">
                      TÍNH TẠI BƯỚC THÀNH TOÁN
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#786F66] bg-[#EAE5D9]/30 p-2 rounded-md border border-[#E1DDD5]/60">
                    * Giá hiển thị đã bao gồm thuế VAT (nếu có).
                  </div>

                  <Separator className="bg-[#E1DDD5]/60 my-2" />

                  <div className="flex justify-between items-center text-sm font-serif font-bold text-black pt-1">
                    <span>Tổng cộng tạm tính</span>
                    <span className="font-mono text-lg text-[#FF9D00]">
                      {formatVND(total / 100)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    Tiến hành thanh toán <ArrowRight className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
