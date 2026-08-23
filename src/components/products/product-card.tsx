"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const emptySubscribe = () => () => {};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const defaultVariant = product.variants?.[0];

  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

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

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="group relative flex flex-col justify-between h-full text-left"
    >
      <Link href={`/${product.slug}`} className="block w-full h-full space-y-4">
        {/* Khung chứa ảnh */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[32px] border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-xs">
          <Image
            src={imgUrl}
            alt={imgAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-102 ${
              isOutOfStock ? "opacity-60 grayscale-[40%]" : "opacity-90"
            }`}
          />

          {/* 🏷️ TAG 1: 🚫 HẾT HÀNG TẠM THỜI (ƯU TIÊN HIỂN THỊ HÀNG ĐẦU) */}
          {isOutOfStock && (
            <span className="absolute top-4 left-4 text-[9px] font-mono font-bold text-white bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 select-none border border-white/20">
              🚫 HẾT HÀNG TẠM THỜI
            </span>
          )}

          {/* 🏷️ TAG 2: GIẢM GIÁ (NẾU CÒN HÀNG) */}
          {!isOutOfStock && isOnSale && (
            <span className="absolute top-4 left-4 text-[9px] font-mono font-bold text-white bg-[#E26E67] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 select-none">
              ⚡ GIẢM GIÁ
            </span>
          )}

          {/* 🏷️ TAG 3: BÁN CHẠY */}
          {!isOutOfStock && product.featured && (
            <span className="absolute top-4 right-4 text-[9px] font-mono font-bold text-black bg-[#FF9D00] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse z-10 select-none">
              🔥 BÁN CHẠY
            </span>
          )}

          {/* NÚT THẢ TIM */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleToggleWishlist}
              className="absolute bottom-4 right-4 z-20 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-[#E1DDD5] text-[#786F66] hover:text-red-500 hover:bg-white shadow-sm transition-all cursor-pointer focus:outline-none"
              aria-label="Thêm vào yêu thích"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </motion.button>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-1.5 px-1">
          <h3 className="font-serif text-base font-bold text-black leading-snug group-hover:text-[#FF9D00] transition-colors duration-300">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-medium text-black/90">
              {defaultVariant &&
                formatPrice(defaultVariant.price, defaultVariant.currency)}
            </span>
            {isOnSale && defaultVariant?.compareAtPrice && (
              <span className="text-xs font-mono text-[#786F66] line-through opacity-60">
                {formatPrice(defaultVariant.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
