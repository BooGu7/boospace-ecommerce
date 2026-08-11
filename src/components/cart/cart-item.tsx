"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { CartItem as CartItemType } from "@/types"; // Import chuẩn xác từ @/types

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [imgSrc, setImgSrc] = useState(item.image?.url || PLACEHOLDER_IMAGE);

  // ẨN HOÀN TOÀN TÊN PHÂN LOẠI TIẾNG ANH MẶC ĐỊNH
  const hasCustomVariant =
    item.variantName &&
    item.variantName !== "Default Variant" &&
    item.variantName !== "Default" &&
    item.variantName !== "Mặc định";

  return (
    <div className="flex gap-4 py-4 items-center font-sans text-left">
      {/* Hình ảnh sản phẩm */}
      <Link
        href={`/${item.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E1DDD5] bg-[#EAE5D9]/20"
      >
        <Image
          src={imgSrc}
          alt={item.image?.alt ?? item.name}
          fill
          sizes="80px"
          className="object-cover"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />
      </Link>

      {/* Chi tiết sản phẩm */}
      <div className="flex flex-1 flex-col justify-between min-w-0 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <Link
            href={`/${item.slug}`}
            className="font-serif font-bold text-sm sm:text-base text-black hover:text-[#FF9D00] truncate transition-colors leading-snug"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors p-1"
            aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Phân loại sản phẩm (Chỉ hiện khi có phân loại tùy chỉnh thực sự) */}
        {hasCustomVariant && (
          <p className="text-xs text-[#786F66] font-medium">
            Phân loại: {item.variantName}
          </p>
        )}

        {/* Đơn giá & Bộ số lượng */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center border border-[#CFCABF] rounded-lg bg-[#FCFAF2] overflow-hidden">
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.variantId, Math.max(1, item.quantity - 1))
              }
              className="px-2.5 py-1 text-xs font-mono font-bold hover:bg-[#EAE5D9]/50 cursor-pointer"
              aria-label="Giảm số lượng"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 text-xs font-mono font-bold text-black">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="px-2.5 py-1 text-xs font-mono font-bold hover:bg-[#EAE5D9]/50 cursor-pointer"
              aria-label="Tăng số lượng"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="text-right font-mono">
            <p className="text-sm font-bold text-black">
              {formatPrice(item.lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-[#786F66] font-normal">
                {formatPrice(item.price)} / sản phẩm
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
