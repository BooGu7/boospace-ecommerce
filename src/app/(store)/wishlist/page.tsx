"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";
import { motion, Variants } from "framer-motion";

// Cấu hình Hoạt ảnh xuất hiện tuần tự (Type-safe Variants)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5]">
          <h1 className="font-serif text-4xl font-bold tracking-tight">
            Yêu thích
          </h1>
        </div>
      </div>
    );
  }

  // HÀM TỰ PHÒNG NGỪA LỖI NHÂN ĐÔI GIÁ TIỀN TRÊN LOCAL STORE
  const getSafePrice = (price: number) => {
    // Nếu giá lưu trữ đã ở dạng cents nhân 100 sẵn (ví dụ > 10,000,000), ta không nhân thêm nữa.
    // Nếu là giá gốc thô VND thực tế (ví dụ 450000), ta nhân 100 để triệt tiêu phép chia trong formatPrice.
    return price > 10000000 ? price : price * 100;
  };

  // Chuyển đổi mượt mà cấu trúc dữ liệu Local Store sang Interface Product của Storefront
  const wishlistedProducts: Product[] = wishlistItems.map(
    (item) =>
      ({
        id: item.productId,
        slug: item.slug,
        name: item.name,
        images: [item.image],
        status: "active",
        variants: [
          {
            price: getSafePrice(item.price), // Sử dụng hàm tự sửa lỗi thông minh
            compareAtPrice: null,
            inventory: { quantity: 99, allowBackorder: true },
          },
        ],
        tags: [],
      }) as unknown as Product,
  );

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              SAVED ITEMS
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Yêu thích
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider font-semibold">
              Có {wishlistedProducts.length} sản phẩm đang nằm trong danh sách
              chờ của bạn
            </p>
          </div>
        </div>

        {wishlistedProducts.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Danh sách yêu thích của bạn đang trống"
            description="Hãy lưu những sản phẩm bạn thích để dễ dàng tìm lại sau này nhé ✨"
            actionLabel="Khám phá sản phẩm"
            actionHref="/shop"
          />
        ) : (
          /* HIỂN THỊ DANH SÁCH HOẠT ẢNH THÁC ĐỔ */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 border-t border-[#E1DDD5] pt-12"
          >
            {wishlistedProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
