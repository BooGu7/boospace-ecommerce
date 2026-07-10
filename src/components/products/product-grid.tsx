import { ProductCard } from "./product-card";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 bg-transparent">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          // Tự động kích hoạt nạp ưu tiên cho 4 sản phẩm đầu tiên phía trên màn hình (index < 4) [1.1]
          priority={index < 4}
        />
      ))}
    </div>
  );
}
