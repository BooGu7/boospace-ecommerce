"use client";

import { useEffect, useState } from "react";
import { Heart, Landmark } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { useWishlistStore } from "@/store/wishlist";
import type { Product } from "@/types";

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5]">
          <h1 className="text-4xl font-serif">Wishlist</h1>
        </div>
      </div>
    );
  }

  // Chuyển đổi dữ liệu đã lưu trong Local Store thành định dạng Product thô mượt mà để tránh chia 100 [21]
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
            price: item.price * 100, // Nhân 100 để triệt tiêu phép chia trong formatPrice [21]
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
        {/* HEADER SECTION */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              05 / SAVED ITEMS
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Yêu thích
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
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
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 border-t border-[#E1DDD5] pt-12">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
