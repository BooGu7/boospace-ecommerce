"use client";

import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  const shipping = subtotal >= siteConfig.freeShippingThreshold ? 0 : 30000;
  const tax = Math.round(subtotal * siteConfig.taxRate);
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-3 font-sans text-left text-xs sm:text-sm">
      <div className="flex justify-between">
        <span className="text-[#786F66]">Cộng tạm tính</span>
        <span className="font-mono font-medium text-black">{formatPrice(subtotal)}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-[#786F66]">Phí vận chuyển ước tính</span>
        <span className="font-mono font-bold text-black">
          {shipping === 0 ? <span className="text-[#3ECF8E]">Miễn phí</span> : formatPrice(shipping)}
        </span>
      </div>

      {tax > 0 && (
        <div className="flex justify-between">
          <span className="text-[#786F66]">Thuế ước tính</span>
          <span className="font-mono font-medium text-black">{formatPrice(tax)}</span>
        </div>
      )}

      <Separator className="bg-[#E1DDD5]/60" />

      <div className="flex justify-between font-serif font-bold text-base text-black">
        <span>Tổng cộng</span>
        <span className="font-mono text-lg text-[#FF9D00]">{formatPrice(total)}</span>
      </div>

      {subtotal > 0 && subtotal < siteConfig.freeShippingThreshold && (
        <p className="text-[11px] font-mono text-[#786F66]">
          * Mua thêm {formatPrice(siteConfig.freeShippingThreshold - subtotal)} để được miễn phí vận chuyển.
        </p>
      )}
    </div>
  );
}
