"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName?: string;
}

export function ProductGallery({ images, productName = "Product" }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#E1DDD5] bg-[#FAF5F2]">
        <Image
          src={currentImage?.url ?? PLACEHOLDER_IMAGE}
          alt={currentImage?.alt ?? productName}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-xl border transition-all cursor-pointer shrink-0 bg-[#FAF5F2]",
                selectedIndex === index
                  ? "border-black ring-1 ring-black"
                  : "border-[#E1DDD5] hover:border-[#786F66]",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url ?? PLACEHOLDER_IMAGE}
                alt={image.alt ?? `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
