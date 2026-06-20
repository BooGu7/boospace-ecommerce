"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartStore } from "@/store/cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useEffect, useState } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <PageHeader title="Giỏ hàng" />
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <PageHeader title="Giỏ hàng" />

        <EmptyState
          icon={ShoppingBag}
          title="Giỏ hàng của bạn đang trống"
          description="Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng."
          actionLabel="Tiếp tục mua sắm"
          actionHref="/shop"
        />
      </div>
    );
  }

  const subtotal = getSubtotal();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-16 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader title="Shopping Cart" />
      <div className="mt-8">
        <div className="divide-y">
          {items.map((item) => (
            <CartItem key={item.variantId} item={item} />
          ))}
        </div>
        <Separator className="my-6" />
        <CartSummary subtotal={subtotal} />
        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" asChild>
            <Link href="/checkout">Tiến hành thanh toán</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
