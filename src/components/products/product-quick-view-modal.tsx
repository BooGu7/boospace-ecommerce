"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Droplets,
  Feather,
  Heart,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";

interface ColorItem {
  name: string;
  hex: string;
}

interface ProductQuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function extractProductColors(attrs: Record<string, unknown>): ColorItem[] {
  if (Array.isArray(attrs.colors) && attrs.colors.length > 0) {
    return attrs.colors as ColorItem[];
  }

  const rawNames = String(attrs.color_name || "").trim();
  const rawHexes = String(attrs.color_hex || "").trim();

  if (!rawNames && !rawHexes) return [];

  const names = rawNames
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const hexes = rawHexes
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (names.length > 1) {
    return names.map((name, i) => ({
      name,
      hex: hexes[i] || "#334155",
    }));
  }

  return [
    {
      name: rawNames || "Mặc định",
      hex: rawHexes || "#334155",
    },
  ];
}

export function ProductQuickViewModal({
  product,
  open,
  onOpenChange,
}: ProductQuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  if (!product) return null;

  const defaultVariant = product.variants?.[0];
  const isWishlisted = wishlistItems.some((i) => i.productId === product.id);

  const attrs =
    (product as unknown as { attributes?: Record<string, unknown> })
      .attributes || {};
  const availableColors = extractProductColors(attrs);
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(
    availableColors[0] || null,
  );

  const currentStock =
    (product as { stock?: number }).stock ??
    defaultVariant?.inventory?.quantity ??
    0;
  const isOutOfStock = currentStock <= 0;

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) =>
          typeof img === "string" ? img : img.url || PLACEHOLDER_IMAGE,
        )
      : [PLACEHOLDER_IMAGE];

  const currentImg = images[selectedImageIndex] || images[0];

  const isOnSale = Boolean(
    defaultVariant?.compareAtPrice &&
      defaultVariant.compareAtPrice > defaultVariant.price,
  );

  const handleAddToCart = () => {
    if (!defaultVariant || isOutOfStock) return;

    const finalVariantName = selectedColor
      ? `Màu: ${selectedColor.name}`
      : defaultVariant.name !== "Default Variant"
        ? defaultVariant.name
        : "Mặc định";

    addToCart({
      variantId: `${defaultVariant.id}-${selectedColor?.name || "default"}`,
      productId: product.id,
      name: product.name,
      variantName: finalVariantName,
      image: { url: currentImg, alt: product.name },
      slug: product.slug,
      price: defaultVariant.price,
      quantity,
    });

    onOpenChange(false);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng ✨`);
    openCart();
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast("Đã xóa khỏi danh sách yêu thích");
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: defaultVariant?.price ?? 0,
        image: { url: currentImg, alt: product.name },
      });
      toast.success("Đã lưu vào danh sách yêu thích ✨");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-4xl p-0 overflow-hidden rounded-[32px] border border-[#E1DDD5] bg-[#FCFAF2] text-[#1E1C1A] shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* CỘT TRÁI: GALLERY ẢNH & THÔNG SỐ VẬT LIỆU */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-[#F7F4EB] border-b md:border-b-0 md:border-r border-[#E1DDD5] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* ẢNH CHÍNH */}
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-sm group">
                <Image
                  src={currentImg}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${
                    isOutOfStock ? "opacity-60 grayscale-[30%]" : "opacity-95"
                  }`}
                />

                {/* BADGE TỒN KHO & SALE */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  {isOutOfStock ? (
                    <span className="text-[10px] font-mono font-bold text-white bg-slate-900 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      🚫 HẾT HÀNG TẠM THỜI
                    </span>
                  ) : isOnSale ? (
                    <span className="text-[10px] font-mono font-bold text-white bg-red-600 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      ⚡ ƯU ĐÃI ĐẶC BIỆT
                    </span>
                  ) : null}
                </div>

                {/* NÚT THẢ TIM */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-[#E1DDD5] text-[#786F66] hover:text-red-500 shadow-sm transition-all cursor-pointer"
                  aria-label="Thêm vào danh sách yêu thích"
                >
                  <Heart
                    className={`size-4 ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
              </div>

              {/* THUMBNAILS NẾU CÓ NHIỀU ẢNH */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative size-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-amber-600 ring-2 ring-amber-600/30"
                          : "border-[#E1DDD5] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ĐIỂM NHẤN HOÀN THIỆN & CẢM XÚC */}
            <div className="p-4 rounded-2xl bg-white/80 border border-[#E1DDD5] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#786F66] uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-black">
                  <Sparkles className="size-3.5 text-amber-600" /> Điểm nhấn hoàn thiện:
                </span>
                <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md text-[10px]">
                  Thiết kế độc bản
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans text-[#5C564E]">
                <div className="flex items-center gap-1.5">
                  <Feather className="size-3 text-amber-600" />
                  <span>Bề mặt nhám mịn tựa gốm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-amber-600" />
                  <span>Bền bỉ cùng thời gian</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="size-3 text-amber-600" />
                  <span>Kháng nước &amp; Dễ lau sạch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="size-3 text-amber-600" />
                  <span>Chăm chút thủ công tỉ mỉ</span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT SẢN PHẨM & NÚT THÊM GIỎ HÀNG */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-5">
              {/* BRAND / CATEGORY BADGE */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                  BOO SPACE STUDIO • SIGNATURE
                </span>
              </div>

              {/* TÊN SẢN PHẨM */}
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black leading-tight">
                {product.name}
              </h2>

              {/* GIÁ TIỀN */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-mono font-bold text-black">
                  {defaultVariant &&
                    formatPrice(defaultVariant.price, defaultVariant.currency)}
                </span>
                {isOnSale && defaultVariant?.compareAtPrice && (
                  <span className="text-sm font-mono text-[#786F66] line-through opacity-70">
                    {formatPrice(defaultVariant.compareAtPrice)}
                  </span>
                )}
                {isOnSale && defaultVariant?.compareAtPrice && (
                  <Badge className="bg-red-50 text-red-700 border-red-200 text-xs font-mono font-bold">
                    Tiết kiệm{" "}
                    {Math.round(
                      ((defaultVariant.compareAtPrice - defaultVariant.price) /
                        defaultVariant.compareAtPrice) *
                        100,
                    )}
                    %
                  </Badge>
                )}
              </div>

              {/* MÔ TẢ NGẮN */}
              <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed font-sans line-clamp-3">
                {product.shortDescription || product.description}
              </p>

              {/* BỘ CHỌN MÀU SẮC */}
              {availableColors.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-[#E1DDD5]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#5C564E] uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="size-3.5 text-amber-600" /> Tùy chọn tông màu:
                    </span>
                    <span className="text-xs font-serif font-bold text-black">
                      {selectedColor?.name || "Mặc định"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((col) => {
                      const isSelected = selectedColor?.name === col.name;
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSelectedColor(col)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-black bg-slate-900 text-white font-bold shadow-sm"
                              : "border-[#E1DDD5] bg-white text-slate-800 hover:border-slate-400"
                          }`}
                        >
                          <span
                            className="size-3.5 rounded-full border border-white/80 shadow-xs shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSelected && (
                              <Check className="size-2 text-white stroke-[3]" />
                            )}
                          </span>
                          <span className="text-xs font-sans">{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* PHẦN DƯỚI: SỐ LƯỢNG + NÚT MUA + XEM CHI TIẾT */}
            <div className="space-y-4 pt-4 border-t border-[#E1DDD5]">
              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={currentStock > 0 ? currentStock : 1}
                  disabled={isOutOfStock}
                />

                <Button
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 font-mono uppercase text-xs tracking-wider rounded-xl py-4 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
                      : "bg-black hover:bg-[#33302C] text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  <ShoppingBag className="size-4" />
                  {isOutOfStock ? "🚫 HẾT HÀNG TẠM THỜI" : "THÊM VÀO GIỎ HÀNG"}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-[#786F66] font-sans">
                  ✓ Miễn phí ship nội thành TP.HCM
                </span>
                <Link
                  href={`/${product.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center gap-1 font-mono uppercase tracking-wider font-bold text-amber-700 hover:text-amber-800 hover:underline"
                >
                  Xem trang chi tiết <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
