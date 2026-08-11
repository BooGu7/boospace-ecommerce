"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean; // Bổ sung prop disabled tùy chọn chuẩn TypeScript
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
        disabled={disabled || quantity <= min}
        aria-label="Giảm số lượng"
        className="flex h-10 w-10 items-center justify-center rounded-l-md border text-sm transition-colors hover:bg-accent disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="flex h-10 w-10 items-center justify-center border-y text-sm font-medium tabular-nums font-mono text-black">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={disabled || quantity >= max}
        aria-label="Tăng số lượng"
        className="flex h-10 w-10 items-center justify-center rounded-r-md border text-sm transition-colors hover:bg-accent disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
