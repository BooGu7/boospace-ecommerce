"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import type { Product } from "@/types";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean; // Nhận thuộc tính nạp ưu tiên từ ngoài Grid để triệt tiêu cảnh báo LCP
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const defaultVariant = product.variants?.[0];

  // Xử lý an toàn cấu trúc ảnh động từ cả database Supabase lẫn file JSON cũ của bạn
  const imgUrl =
    typeof product.images?.[0] === "string"
      ? product.images[0]
      : (product.images?.[0]?.url ?? PLACEHOLDER_IMAGE);

  const imgAlt =
    typeof product.images?.[0] === "string"
      ? product.name
      : (product.images?.[0]?.alt ?? product.name);

  const isOnSale =
    defaultVariant?.compareAtPrice &&
    defaultVariant.compareAtPrice > defaultVariant.price;

  return (
    <motion.div
      whileHover={{ y: -6 }} // Nhấc nổi dẹt mộc mạc khi hover chuẩn hãng
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="group relative flex flex-col justify-between h-full text-left"
    >
      <Link href={`/${product.slug}`} className="block w-full h-full space-y-4">
        {/* Khung chứa ảnh dẹt tròn lớn mộc mạc */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[32px] border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-xs">
          <Image
            src={imgUrl}
            alt={imgAlt}
            fill
            priority={priority} // Bật nạp ưu tiên nếu nằm trên dòng đầu (LCP)
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover mix-blend-multiply opacity-90 group-hover:scale-102 transition-transform duration-500"
          />

          {/* Badge giảm giá dẹt nếu có Sale */}
          {isOnSale && (
            <span className="absolute top-4 left-4 text-[9px] font-mono font-bold text-white bg-[#E26E67] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Phần thông tin sản phẩm rõ nét */}
        <div className="space-y-1.5 px-1">
          <h3 className="font-serif text-base font-bold text-black leading-snug group-hover:text-[#FF9D00] transition-colors duration-300">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-black">
              {defaultVariant &&
                formatPrice(defaultVariant.price, defaultVariant.currency)}
            </span>
            {isOnSale && (
              <span className="text-xs font-mono text-[#786F66] line-through opacity-60">
                {formatPrice(defaultVariant.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
