"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName?: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
}

export function ProductGallery({
  images,
  productName = "Product",
  videoUrl,
  thumbnailUrl,
}: ProductGalleryProps) {
  // selectedIndex: >= 0 is image index, -1 is video
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHoverPreview, setIsHoverPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoSelected = selectedIndex === -1 && Boolean(videoUrl);
  const currentImage = selectedIndex >= 0 ? images[selectedIndex] ?? images[0] : images[0];
  const mainImageUrl = selectedIndex === 0 ? thumbnailUrl || currentImage?.url : currentImage?.url;
  const showVideo = Boolean(videoUrl) && (isVideoSelected || isHoverPreview);

  const handleMouseEnter = () => {
    if (!videoUrl || isVideoSelected || !videoRef.current) return;

    const video = videoRef.current;
    video.currentTime = 0;
    setIsHoverPreview(true);
    void video.play().catch(() => setIsHoverPreview(false));
  };

  const handleMouseLeave = () => {
    if (isVideoSelected) return;

    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
    setIsHoverPreview(false);
  };

  const handleImageSelect = (index: number) => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
    setIsHoverPreview(false);
    setSelectedIndex(index);
  };

  const handleVideoSelect = () => {
    setIsHoverPreview(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image or Video */}
      <div
        className="group relative aspect-square overflow-hidden rounded-3xl border border-[#E1DDD5] bg-[#FAF5F2]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            controls={isVideoSelected}
            autoPlay={isVideoSelected}
            muted={!isVideoSelected}
            loop
            playsInline
            preload="metadata"
            poster={mainImageUrl ?? PLACEHOLDER_IMAGE}
            onError={() => setIsHoverPreview(false)}
            className={cn(
              "absolute inset-0 size-full rounded-3xl object-cover transition-opacity duration-300",
              showVideo ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          />
        )}
        <Image
          src={mainImageUrl ?? PLACEHOLDER_IMAGE}
          alt={currentImage?.alt ?? productName}
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            showVideo ? "opacity-0" : "opacity-100",
          )}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails (Images + Video if available) */}
      {(images.length > 1 || Boolean(videoUrl)) && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 items-center">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleImageSelect(index)}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-xl border transition-all cursor-pointer shrink-0 bg-[#FAF5F2]",
                selectedIndex === index
                  ? "border-black ring-1 ring-black"
                  : "border-[#E1DDD5] hover:border-[#786F66]",
              )}
              aria-label={`Xem ảnh ${index + 1}`}
            >
              <Image
                src={(index === 0 ? thumbnailUrl || image.url : image.url) ?? PLACEHOLDER_IMAGE}
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
              onClick={handleVideoSelect}
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
