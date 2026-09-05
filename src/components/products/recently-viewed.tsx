"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { supabase } from "@/lib/supabase/client"; // Gọi client Supabase động
import { useRecentlyViewedStore } from "@/store/recently-viewed";
import type { Product } from "@/types";
import { ProductCard } from "./product-card";

interface RecentlyViewedProps {
  excludeProductId?: string;
}

export function RecentlyViewed({ excludeProductId }: RecentlyViewedProps) {
  const items = useRecentlyViewedStore((s) => s.items);
  const mounted = useHydrated();
  const [validProducts, setValidProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. KÉO TOÀN BỘ DANH SÁCH SẢN PHẨM HOẠT ĐỘNG THỜI GIAN THỰC TỪ SUPABASE
  // Đối chiếu ID để lọc sạch (purge) các sản phẩm rác cũ khỏi danh sách hiển thị
  useEffect(() => {
    if (!mounted || items.length === 0) {
      return;
    }

    async function syncAndFilterCache() {
      try {
        // Lấy danh sách ID các sản phẩm đang thực sự xuất bản trên Supabase
        const { data: activeDbProducts, error } = await supabase
          .from("products")
          .select("id, name, slug, price, images, thumbnail_url, video_url, published")
          .eq("published", true);

        if (!error && activeDbProducts) {
          const activeIds = new Set(activeDbProducts.map((p) => p.id));

          // Lọc sạch sản phẩm rác chỉ giữ lại các ID đang tồn tại thực tế trên database Supabase [1.1]
          // Không cần gọi hàm removeItem từ store để tránh lỗi chênh lệch phiên bản [1.1]
          const validCachedItems = items.filter((cachedItem) => activeIds.has(cachedItem.productId));

          // Ánh xạ các sản phẩm hợp lệ thành dạng đối tượng Product hoàn chỉnh để hiển thị mượt mà
          const mapped = validCachedItems
            .map((cachedItem) => {
              const dbProduct = activeDbProducts.find((p) => p.id === cachedItem.productId);
              if (!dbProduct) return null;

              // Đồng bộ hóa cấu trúc ảnh và giá tiền chuẩn xác
              const price = Number(dbProduct.price ?? 0) * 100;
              const mappedImages = (dbProduct.images || []).map((url: string, index: number) => ({
                id: `${dbProduct.id}-img-${index}`,
                url: url,
                alt: dbProduct.name,
              }));

              return {
                id: dbProduct.id,
                slug: dbProduct.slug,
                name: dbProduct.name,
                description: "",
                categoryIds: [],
                images: mappedImages,
                thumbnail_url: dbProduct.thumbnail_url || null,
                video_url: dbProduct.video_url || null,
                status: "active" as const,
                variants: [
                  {
                    id: `${dbProduct.id}-default`,
                    productId: dbProduct.id,
                    sku: `SKU-${dbProduct.id.slice(0, 6)}`,
                    name: dbProduct.name,
                    currency: "VND",
                    options: [],
                    images: mappedImages,
                    price: price,
                    compareAtPrice: null,
                    inventory: { quantity: 99, allowBackorder: true },
                  },
                ],
              } as unknown as Product;
            })
            .filter((p): p is Product => p !== null);

          setValidProducts(mapped);
        }
      } catch (err) {
        console.error("Lỗi đồng bộ Recently Viewed:", err);
      } finally {
        setLoading(false);
      }
    }

    syncAndFilterCache();
  }, [mounted, items]);

  if (!mounted || items.length === 0 || loading) return null;

  // Lọc bỏ sản phẩm hiện tại đang xem khỏi danh sách Gợi ý đã xem
  const filteredProducts = excludeProductId ? validProducts.filter((p) => p.id !== excludeProductId) : validProducts;

  if (filteredProducts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#E1DDD5] pt-12 text-left">
      <h2 className="text-xl font-bold tracking-tight font-serif text-black mb-6">Sản phẩm đã xem gần đây</h2>

      {/* Chỉ hiển thị các thẻ sản phẩm hợp lệ, không chứa rác ảnh chim cánh cụt */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 bg-transparent">
        {filteredProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
