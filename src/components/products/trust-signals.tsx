"use client";

import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

export function TrustSignals() {
  return (
    <div className="mt-8 space-y-4 border-t border-[#E1DDD5] pt-6 text-left">
      <div className="flex items-center gap-3 text-sm text-[#5c544d] font-sans">
        <Truck className="h-5 w-5 text-[#786F66]" />
        <span>MIỄN PHÍ VẬN CHUYỂN NỘI THÀNH TP.HCM</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-[#5c544d] font-sans">
        <RotateCcw className="h-5 w-5 text-[#786F66]" />
        <span>Bảo hành chất lượng, đổi trả dễ dàng trong 30 ngày</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-[#5c544d] font-sans">
        <ShieldCheck className="h-5 w-5 text-[#786F66]" />
        <span>Thanh toán COD khi nhận hàng an toàn toàn quốc</span>
      </div>
    </div>
  );
}
