"use client";

import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { ProductQuickViewModal } from "@/components/products/product-quick-view-modal";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const emptySubscribe = () => () => {};

interface ColorItem {
  name: string;
  hex: string;
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

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const defaultVariant = product.variants?.[0];

  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isWishlisted =
    mounted && wishlistItems.some((i) => i.productId === product.id);

  // KIỂM TRA TỒN KHO: TỒN KHO <= 0 LÀ HẾT HÀNG
  const currentStock =
    (product as { stock?: number }).stock ??
    defaultVariant?.inventory?.quantity ??
    0;
  const isOutOfStock = currentStock <= 0;

  const imgUrl =
    typeof product.images?.[0] === "string"
      ? product.images[0]
      : (product.images?.[0]?.url ?? PLACEHOLDER_IMAGE);

  const imgAlt =
    typeof product.images?.[0] === "string"
      ? product.name
      : (product.images?.[0]?.alt ?? product.name);

  const isOnSale = Boolean(
    defaultVariant?.compareAtPrice &&
      defaultVariant.compareAtPrice > defaultVariant.price,
  );

  const attrs =
    (product as unknown as { attributes?: Record<string, unknown> })
      .attributes || {};
  const colors = extractProductColors(attrs);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast("Đã xóa khỏi danh sách yêu thích");
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: defaultVariant?.price ?? 0,
        image:
          typeof product.images?.[0] === "string"
            ? { url: product.images[0], alt: product.name }
            : (product.images?.[0] ?? { url: "", alt: product.name }),
      });
      toast.success("Đã lưu vào danh sách yêu thích ✨");
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || isOutOfStock) return;

    addToCart({
      variantId: `${defaultVariant.id}-default`,
      productId: product.id,
      name: product.name,
      variantName: colors[0] ? `Màu: ${colors[0].name}` : "Mặc định",
      image: { url: imgUrl, alt: product.name },
      slug: product.slug,
      price: defaultVariant.price,
      quantity: 1,
    });

    toast.success(`Đã thêm ${product.name} vào giỏ hàng ✨`);
    openCart();
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex flex-col justify-between h-full text-left bg-white/60 hover:bg-white rounded-[32px] p-3 border border-[#E1DDD5] hover:border-[#C86D51]/40 hover:shadow-xl hover:shadow-[#C86D51]/5 transition-all duration-300"
      >
        <Link href={`/${product.slug}`} className="block w-full h-full space-y-3.5">
          {/* Khung chứa ảnh */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[26px] border border-[#E1DDD5]/80 bg-[#F5F1E6]/60 shadow-xs">
            <Image
              src={imgUrl}
              alt={imgAlt}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={`object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-106 ${
                isOutOfStock ? "opacity-50 grayscale-[40%]" : "opacity-95"
              }`}
            />

            {/* 🏷️ TAG 1: 🚫 HẾT HÀNG TẠM THỜI */}
            {isOutOfStock && (
              <span className="absolute top-3.5 left-3.5 text-[9px] font-mono font-bold text-white bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 select-none border border-white/20">
                🚫 HẾT HÀNG TẠM THỜI
              </span>
            )}

            {/* 🏷️ TAG 2: GIẢM GIÁ (NẾU CÒN HÀNG) */}
            {!isOutOfStock && isOnSale && (
              <span className="absolute top-3.5 left-3.5 text-[9px] font-mono font-bold text-white bg-[#C86D51] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 select-none">
                ⚡ GIẢM GIÁ
              </span>
            )}

            {/* 🏷️ TAG 3: TUYỂN CHỌN (NẾU FEATURED) */}
            {!isOutOfStock && !isOnSale && product.featured && (
              <span className="absolute top-3.5 left-3.5 text-[9px] font-mono font-bold text-amber-900 bg-amber-100/90 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10 select-none border border-amber-300/60">
                ✦ Tuyển chọn
              </span>
            )}

            {/* NÚT THẢ TIM */}
            {mounted && (
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-3.5 right-3.5 z-20 size-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-[#E1DDD5] text-[#786F66] hover:text-red-500 hover:bg-white shadow-xs transition-all cursor-pointer focus:outline-none"
                aria-label="Thêm vào yêu thích"
              >
                <Heart
                  className={`size-3.5 transition-colors ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </button>
            )}

            {/* THANH HÀNH ĐỘNG NHANH TRÊN HOVER (QUICK VIEW & QUICK ADD) */}
            <div className="absolute inset-x-3 bottom-3 z-20 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button
                type="button"
                onClick={handleOpenQuickView}
                className="flex-1 py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md text-black font-sans font-bold text-xs shadow-md hover:bg-white hover:text-amber-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#E1DDD5]"
              >
                <Eye className="size-3.5 text-amber-600" />
                <span>Xem nhanh</span>
              </button>

              {!isOutOfStock && (
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="size-8 rounded-xl bg-black text-white flex items-center justify-center shadow-md hover:bg-[#33302C] transition-all cursor-pointer shrink-0"
                  aria-label="Thêm nhanh vào giỏ"
                >
                  <ShoppingBag className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="space-y-1.5 px-1.5 pb-1">
            {/* COLOR DOTS INDICATORS */}
            {colors.length > 0 && (
              <div className="flex items-center gap-1.5 pt-0.5">
                {colors.slice(0, 4).map((col) => (
                  <span
                    key={col.name}
                    title={col.name}
                    className="size-2.5 rounded-full border border-black/15 shadow-xs inline-block"
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-[10px] font-mono text-[#786F66]">
                    +{colors.length - 4}
                  </span>
                )}
                <span className="text-[10px] font-mono text-[#786F66] ml-1">
                  {colors.length} tông màu
                </span>
              </div>
            )}

            <h3 className="font-serif text-base font-bold text-black leading-snug group-hover:text-amber-700 transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono font-bold text-black">
                  {defaultVariant &&
                    formatPrice(defaultVariant.price, defaultVariant.currency)}
                </span>
                {isOnSale && defaultVariant?.compareAtPrice && (
                  <span className="text-xs font-mono text-[#786F66] line-through opacity-60">
                    {formatPrice(defaultVariant.compareAtPrice)}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono text-[#786F66] bg-[#F5F1E6]/80 px-2 py-0.5 rounded-md border border-[#E1DDD5]">
                Độc bản
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* QUICK VIEW MODAL */}
      <ProductQuickViewModal
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
