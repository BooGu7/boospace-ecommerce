"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Heart,
  Layers,
  ShieldCheck,
  Cpu,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useRecentlyViewedStore } from "@/store/recently-viewed";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { StarRating } from "@/components/products/star-rating";
import { TrustSignals } from "@/components/products/trust-signals";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/products/product-gallery";
import { VariantSelector } from "@/components/products/variant-selector";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { ProductGrid } from "@/components/products/product-grid";
import { formatPrice } from "@/lib/utils";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import type { Product, Brand, Category } from "@/types";
import { ReviewsSection } from "@/components/products/reviews-section";
import { supabase } from "@/lib/supabase/client";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  brand: Brand | null;
  categoryAncestors?: Category[];
}

export function ProductDetailView({
  product,
  relatedProducts,
  brand,
  categoryAncestors = [],
}: ProductDetailViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  // States quản lý đánh giá sao động nạp từ Supabase Reviews
  const [avgRating, setAvgRating] = useState(product.rating || 5);
  const [reviewCount, setReviewCount] = useState(product.reviewCount || 0);

  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isWishlisted =
    mounted && wishlistItems.some((i) => i.productId === product.id);

  // KÉO DỮ LIỆU ĐÁNH GIÁ THỰC TẾ CỦA NGƯỜI DÙNG TỪ SUPABASE ĐỂ TÍNH ĐIỂM SAO ĐỘNG
  useEffect(() => {
    async function fetchDynamicRatings() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("rating")
          .eq("product_id", product.id);

        if (!error && data && data.length > 0) {
          const total = data.length;
          const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
          const average = Number((sum / total).toFixed(1));
          setAvgRating(average);
          setReviewCount(total);
        }
      } catch (err) {
        console.error("Lỗi đồng bộ đánh giá động:", err);
      }
    }
    fetchDynamicRatings();
  }, [product.id]);

  // Theo dõi lịch sử xem sản phẩm
  useEffect(() => {
    addRecentlyViewed({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.variants[0]?.price ?? 0,
      imageUrl: product.images[0]?.url ?? "",
      imageAlt: product.images[0]?.alt ?? product.name,
    });
  }, [product.id]);

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  );
  if (!selectedVariant) return null;

  const isOnSale =
    selectedVariant.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price;
  const inStock =
    selectedVariant.inventory.quantity > 0 ||
    selectedVariant.inventory.allowBackorder;

  function handleAddToCart() {
    addToCart({
      variantId: selectedVariant!.id,
      productId: product.id,
      name: product.name,
      variantName: selectedVariant!.name,
      image: product.images[0] ?? { url: "", alt: product.name },
      slug: product.slug,
      price: selectedVariant!.price,
      quantity,
    });
    openCart();
  }

  // Hàm thêm nhanh sản phẩm mua kèm vào giỏ hàng dứt khoát
  function handleAddAddonToCart(addon: Product) {
    const addonVariant = addon.variants?.[0];
    if (addonVariant) {
      addToCart({
        variantId: addonVariant.id,
        productId: addon.id,
        name: addon.name,
        variantName: addonVariant.name || "Default Variant",
        image: addon.images[0] ?? { url: "", alt: addon.name },
        slug: addon.slug,
        price: addonVariant.price,
        quantity: 1,
      });
      toast.success(`Đã thêm ${addon.name} vào giỏ hàng ✨`);
      openCart();
    }
  }

  function handleToggleWishlist() {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast("Đã xóa khỏi danh sách yêu thích");
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: selectedVariant!.price,
        image: product.images[0] ?? { url: "", alt: product.name },
      });
      toast.success("Đã lưu vào danh sách yêu thích ✨");
    }
  }

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Cửa hàng", href: "/shop" },
    ...categoryAncestors.map((c) => ({ name: c.name, href: `/${c.slug}` })),
    { name: product.name, href: `/${product.slug}` },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: selectedVariant.sku,
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: (selectedVariant.price / 100).toFixed(2),
      priceCurrency: selectedVariant.currency,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const attrs = (product as any).attributes || {};

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([jsonLd, breadcrumbLd]),
          }}
        />

        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/shop" />}>
                Cửa hàng
              </BreadcrumbLink>
            </BreadcrumbItem>
            {categoryAncestors.map((cat, idx) => {
              const isLast = idx === categoryAncestors.length - 1;
              return (
                <div key={cat.id} className="contents">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{cat.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link href={`/${cat.slug}`} />}>
                        {cat.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Product Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16 items-start pb-16 border-b border-[#E1DDD5]/60">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Info */}
          <div className="flex flex-col text-left">
            <div>
              <StarRating rating={avgRating} reviewCount={reviewCount} />
            </div>

            {/* DẢI BADGES GIẢM GIÁ / BÁN CHẠY NHẤP NHÁY MƯỢT Ở TRÊN TIÊU ĐỀ */}
            <div className="flex flex-wrap gap-2.5 mt-3 mb-1">
              {isOnSale && (
                <span className="text-[9px] font-mono font-bold text-white bg-[#E26E67] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse select-none">
                  ⚡ GIẢM GIÁ
                </span>
              )}
              {product.featured && (
                <span className="text-[9px] font-mono font-bold text-black bg-[#FF9D00] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse select-none">
                  🔥 BÁN CHẠY
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black font-serif">
              {product.name}
            </h1>

            {brand && (
              <Link
                href={`/${brand.slug}`}
                className="mt-1 text-sm text-[#786F66] hover:text-black hover:underline font-mono uppercase tracking-wider font-semibold"
              >
                {brand.name}
              </Link>
            )}

            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold text-black/90">
                {formatPrice(selectedVariant.price, selectedVariant.currency)}
              </span>
              {isOnSale && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(
                      selectedVariant.compareAtPrice!,
                      selectedVariant.currency,
                    )}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-[#EAE5D9]/40 border border-[#DCD6CC] text-[#786F66] text-xs font-mono uppercase"
                  >
                    Giảm{" "}
                    {Math.round(
                      (1 -
                        selectedVariant.price /
                          selectedVariant.compareAtPrice!) *
                        100,
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#5C564E] leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Variants Selection */}
            {product.variants.length > 1 && (
              <div className="mt-6 mb-6">
                <VariantSelector
                  variants={product.variants}
                  selectedVariantId={selectedVariantId}
                  onSelect={setSelectedVariantId}
                />
              </div>
            )}

            {/* Quantity Selector + Add to Cart */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mt-6 border-b border-[#E1DDD5]/60 pb-8">
              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={selectedVariant.inventory.quantity || 99}
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  onClick={handleToggleWishlist}
                  className="rounded-xl border-[#E1DDD5] hover:bg-[#EAE5D9]/20"
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-wishlist text-wishlist" : ""}`}
                  />
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full sm:flex-1 bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs tracking-wider rounded-xl py-4 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 text-white" />
                {inStock ? "Thêm vào giỏ hàng" : "Hết hàng tạm thời"}
              </Button>
            </div>

            {!inStock && (
              <p className="mt-2 text-xs font-mono text-red-500 uppercase tracking-wider font-semibold">
                Sản phẩm này hiện đang hết hàng tạm thời.
              </p>
            )}

            {/* ============================================================================
               NÂNG CẤP: BẢNG SẢN PHẨM MUA KÈM ƯU ĐÃI (HIỆU ỨNG VIỀN CHẠY PHÁT SÁNG NỔI BẬT & ẢNH CÂN ĐỐI) [1.1]
               ============================================================================ */}
            {relatedProducts.length > 0 && (
              <div
                style={{
                  border: "1px solid transparent",
                  backgroundImage:
                    "linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #FF9D00, #E26E67, #3ECF8E, #FF9D00)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  backgroundSize: "300% 300%",
                }}
                className="mt-8 rounded-[28px] p-6 bg-white flex flex-col gap-4 shadow-sm relative overflow-hidden transition-all duration-500 hover:shadow-md animate-gradient-shift"
              >
                <div className="space-y-1 relative z-10">
                  <h4 className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold">
                    Mua kèm ưu đãi
                  </h4>
                  <p className="text-[11px] text-[#5C564E] font-sans leading-none">
                    Hoàn thiện không gian sống của bạn.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  {relatedProducts.slice(0, 2).map((item) => {
                    const addonImgUrl =
                      typeof item.images?.[0] === "string"
                        ? item.images[0]
                        : item.images?.[0]?.url || PLACEHOLDER_IMAGE;
                    const addonVariant = item.variants?.[0];
                    const isAddonSale =
                      addonVariant?.compareAtPrice &&
                      addonVariant.compareAtPrice > addonVariant.price;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-white border border-[#E1DDD5]/80 rounded-2xl shadow-xs hover:border-black/20 transition-all"
                      >
                        {/* ẢNH THU NHỎ ĐƯỢC PHÓNG TO KÍCH THƯỚC H-16 W-16 CÂN ĐỐI [1.1] */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-inner">
                          <Image
                            src={addonImgUrl}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        {/* Title & Price */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs sm:text-sm font-serif font-bold text-black truncate leading-snug">
                            {item.name}
                          </p>
                          <div className="flex items-baseline gap-1.5 mt-1 font-mono text-[10px] sm:text-xs">
                            <span className="font-bold text-black">
                              {addonVariant && formatPrice(addonVariant.price)}
                            </span>
                            {isAddonSale && (
                              <span className="text-[#786F66] line-through opacity-60">
                                {formatPrice(addonVariant.compareAtPrice!)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Phím bấm ADD + dẹt mộc mạc chuẩn Daylight */}
                        <button
                          onClick={() => handleAddAddonToCart(item)}
                          className="rounded-lg bg-black hover:bg-[#33302C] text-[9px] font-mono font-bold tracking-widest text-white px-3.5 py-2.5 uppercase shadow-sm shrink-0 cursor-pointer transition-colors"
                        >
                          ADD +
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <TrustSignals />
          </div>
        </div>

        {/* ============================================================================
           BỘ PHÂN GIẢI THÔNG SỐ MA TRẬN ĐỘNG (MAKERWORLD-STYLE DYNAMIC RENDERING) [21]
           ============================================================================ */}
        <div className="py-20 border-b border-[#E1DDD5]/60 text-left">
          <div className="bg-black text-white p-4 rounded-full flex items-center max-w-full justify-between select-none mb-12 shadow-sm">
            <span className="font-serif text-lg font-bold pl-4">
              Product Specifications
            </span>
            <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase pr-4">
              Hệ sinh thái in 3D
            </span>
          </div>

          {/* 1. Bento Cards hiển thị tính năng độc bản */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-[#FAF5F2] border border-[#E1DDD5] rounded-3xl flex flex-col justify-between min-h-[180px]">
              <Layers className="size-6 text-[#FF9D00]" />
              <div className="space-y-2 mt-6">
                <h3 className="font-serif text-lg font-bold text-black leading-none">
                  Vật liệu sinh học
                </h3>
                <p className="text-xs text-[#5C564E] leading-relaxed">
                  {attrs.material ||
                    "Chế tác từ nhựa sinh học phân hủy hữu cơ PLA lành tính, không mùi."}
                </p>
              </div>
            </div>

            <div className="p-8 bg-[#FAF5F2] border border-[#E1DDD5] rounded-3xl flex flex-col justify-between min-h-[180px]">
              <Cpu className="size-6 text-[#FF9D00]" />
              <div className="space-y-2 mt-6">
                <h3 className="font-serif text-lg font-bold text-black leading-none">
                  Độ mịn lớp in
                </h3>
                <p className="text-xs text-[#5C564E] leading-relaxed">
                  Độ phân giải siêu mịn {attrs.layer_height || "0.15mm"} dệt nên
                  cấu trúc hình học nguyên khối bóng nhám.
                </p>
              </div>
            </div>

            <div className="p-8 bg-[#FAF5F2] border border-[#E1DDD5] rounded-3xl flex flex-col justify-between min-h-[180px]">
              <Award className="size-6 text-[#FF9D00]" />
              <div className="space-y-2 mt-6">
                <h3 className="font-serif text-lg font-bold text-black leading-none">
                  Bản quyền thiết kế
                </h3>
                <p className="text-xs text-[#5C564E] leading-relaxed">
                  Tác phẩm sở hữu giấy phép {attrs.license || "CC BY-NC-SA 4.0"}{" "}
                  phân phối mộc mạc và an toàn.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Dotted Spec Table - NẠP DỮ LIỆU ĐỘNG TỪ SUPABASE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-sans text-sm">
            {/* Cột 1 */}
            <div className="space-y-5">
              <h4 className="font-serif text-base font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
                Cơ lý tính &amp; Vật liệu
              </h4>
              <div className="space-y-3 font-mono text-xs text-[#5C564E]">
                <div className="flex justify-between border-b border-dashed border-[#E1DDD5]/80 pb-2.5">
                  <span>Chất liệu chính</span>
                  <span className="text-black font-bold truncate max-w-[150px]">
                    {attrs.material || "Matte PLA"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#E1DDD5]/80 pb-2.5">
                  <span>Kháng nước</span>
                  <span className="text-black font-bold">
                    Kháng nước &amp; bụi mịn
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Hệ số an toàn</span>
                  <span className="text-black font-bold">
                    Không mùi sinh học
                  </span>
                </div>
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-5">
              <h4 className="font-serif text-base font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
                Thông số in 3D
              </h4>
              <div className="space-y-3 font-mono text-xs text-[#5C564E]">
                <div className="flex justify-between border-b border-dashed border-[#E1DDD5]/80 pb-2.5">
                  <span>Cấu trúc Infill</span>
                  <span className="text-[#3ECF8E] font-bold">
                    {attrs.infill || "Gyroid Infill"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#E1DDD5]/80 pb-2.5">
                  <span>Độ mịn lớp in</span>
                  <span className="text-black font-bold">
                    {attrs.layer_height || "0.15mm"}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Phương thức lắp</span>
                  <span className="text-black font-bold truncate max-w-[150px]">
                    {attrs.assembly || "Nguyên khối"}
                  </span>
                </div>
              </div>
            </div>

            {/* Cột 3 */}
            <div className="space-y-5">
              <h4 className="font-serif text-base font-bold text-black border-b border-[#E1DDD5]/60 pb-2">
                Đặc tính phần cứng
              </h4>
              <div className="space-y-3 font-mono text-xs text-[#5C564E]">
                <div className="flex justify-between border-b border-dashed border-[#E1DDD5]/80 pb-2.5">
                  <span>Tương thích cứng</span>
                  <span className="text-black font-bold truncate max-w-[150px]">
                    {attrs.hardware || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#E1DDD5]/80 pb-2.5">
                  <span>Hình thức đóng gói</span>
                  <span className="text-black font-bold">
                    Hộp giấy Kraft mộc
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Bản quyền tác giả</span>
                  <span className="text-[#3ECF8E] font-bold truncate max-w-[150px]">
                    {attrs.license || "CC License"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full HTML description (Nếu có) */}
        {product.body && (
          <section className="py-12">
            <div className="mx-auto max-w-3xl">
              <div
                className="blog-body text-left"
                dangerouslySetInnerHTML={{ __html: product.body }}
              />
            </div>
          </section>
        )}

        <ReviewsSection productId={product.id} />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-[#E1DDD5] pt-12 text-left">
            <h2 className="text-xl font-bold tracking-tight font-serif text-black">
              Có thể bạn cũng thích
            </h2>
            <div className="mt-6">
              <ProductGrid products={relatedProducts} />
            </div>
          </section>
        )}

        {/* Recently viewed */}
        <RecentlyViewed excludeProductId={product.id} />
      </div>
    </div>
  );
}
