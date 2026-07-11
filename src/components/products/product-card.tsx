"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import { Heart } from "lucide-react"; // Nhập khẩu icon trái tim
import { useWishlistStore } from "@/store/wishlist"; // Kết nối với Wishlist Store cục bộ [21]
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean; // Nhận thuộc tính nạp ưu tiên từ ngoài Grid để triệt tiêu cảnh báo LCP
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const defaultVariant = product.variants?.[0];

  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isWishlisted =
    mounted && wishlistItems.some((i) => i.productId === product.id);

  // Xử lý an toàn cấu trúc ảnh động từ cả database Supabase lẫn file JSON cũ
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

  // Lập trình thả tim tương tác nhanh (Chặn nhảy link chuyển tiếp trang) [1.1]
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
            <span className="absolute top-4 left-4 text-[9px] font-mono font-bold text-white bg-[#E26E67] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 select-none">
              ⚡ GIẢM GIÁ
            </span>
          )}

          {/* Badge bán chạy dẹt nhấp nháy mượt ở góc phải */}
          {product.featured && (
            <span className="absolute top-4 right-4 text-[9px] font-mono font-bold text-black bg-[#FF9D00] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse z-10 select-none">
              🔥 BÁN CHẠY
            </span>
          )}

          {/* NÚT THẢ TIM DI ĐỘNG NỔI BẬT GÓC DƯỚI BÊN PHẢI (HOÀN TOÀN ĐỒNG BỘ) [1.1] */}
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

        {/* Phần thông tin sản phẩm rõ nét */}
        <div className="space-y-1.5 px-1">
          <h3 className="font-serif text-base font-bold text-black leading-snug group-hover:text-[#FF9D00] transition-colors duration-300">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            {/* Chuyển sang font-medium mộc mạc, nhẹ nhàng hơn theo chuẩn tạp chí */}
            <span className="text-sm font-mono font-medium text-black/90">
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
