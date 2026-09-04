"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName?: string;
  videoUrl?: string | null;
}

export function ProductGallery({ images, productName = "Product", videoUrl }: ProductGalleryProps) {
  // selectedIndex: >= 0 is image index, -1 is video
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isVideoSelected = selectedIndex === -1 && Boolean(videoUrl);
  const currentImage = images[selectedIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image or Video */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#E1DDD5] bg-[#FAF5F2]">
        {isVideoSelected && videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover rounded-3xl"
          />
        ) : (
          <Image
            src={currentImage?.url ?? PLACEHOLDER_IMAGE}
            alt={currentImage?.alt ?? productName}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {/* Thumbnails (Images + Video if available) */}
      {(images.length > 1 || Boolean(videoUrl)) && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 items-center">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-xl border transition-all cursor-pointer shrink-0 bg-[#FAF5F2]",
                selectedIndex === index
                  ? "border-black ring-1 ring-black"
                  : "border-[#E1DDD5] hover:border-[#786F66]",
              )}
              aria-label={`Xem ảnh ${index + 1}`}
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

          {/* Nút Thumbnail Video */}
          {videoUrl && (
            <button
              type="button"
              onClick={() => setSelectedIndex(-1)}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-xl border transition-all cursor-pointer shrink-0 bg-slate-900 text-white flex flex-col items-center justify-center gap-1",
                selectedIndex === -1
                  ? "border-amber-500 ring-2 ring-amber-500"
                  : "border-slate-800 hover:border-amber-400 opacity-80 hover:opacity-100",
              )}
              aria-label="Xem video sản phẩm"
            >
              <Play className="size-4 fill-amber-400 text-amber-400" />
              <span className="text-[9px] font-mono uppercase tracking-wider font-bold">Video</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
