"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  Check,
  Feather,
  Heart,
  Palette,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { FormattedDescription } from "@/components/products/formatted-description";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductGrid } from "@/components/products/product-grid";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { ReviewsSection } from "@/components/products/reviews-section";
import { StarRating } from "@/components/products/star-rating";
import { TrustSignals } from "@/components/products/trust-signals";
import { VariantSelector } from "@/components/products/variant-selector";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useRecentlyViewedStore } from "@/store/recently-viewed";
import { useWishlistStore } from "@/store/wishlist";
import type { Brand, Category, Product } from "@/types";

interface ColorItem {
  name: string;
  hex: string;
}

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  brand: Brand | null;
  categoryAncestors?: Category[];
}

const emptySubscribe = () => () => {};

function extractProductColors(attrs: Record<string, unknown>): ColorItem[] {
  if (Array.isArray(attrs.colors) && attrs.colors.length > 0) {
    return attrs.colors as ColorItem[];
  }

  const rawNames = String(attrs.color_name || "").trim();
  const rawHexes = String(attrs.color_hex || "").trim();

  if (!rawNames && !rawHexes) return [];

  const names = rawNames
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const hexes = rawHexes
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (names.length > 1) {
    return names.map((name, i) => ({
      name,
      hex: hexes[i] || "#334155",
    }));
  }

  return [
    {
      name: rawNames || "Mặc định",
      hex: rawHexes || "#334155",
    },
  ];
}

// ĐÃ SỬA: DÙNG NAMED EXPORT ĐỂ KHỚP VỚI import { ProductDetailView } TRONG page.tsx
export function ProductDetailView({
  product,
  relatedProducts,
  brand,
  categoryAncestors = [],
}: ProductDetailViewProps) {
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const [avgRating, setAvgRating] = useState(product.rating || 5);
  const [reviewCount, setReviewCount] = useState(product.reviewCount || 0);

  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isWishlisted =
    mounted && wishlistItems.some((i) => i.productId === product.id);

  const attrs =
    (product as unknown as { attributes?: Record<string, unknown> })
      .attributes || {};
  const availableColors = extractProductColors(attrs);

  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(
    availableColors[0] || null,
  );

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
          setAvgRating(Number((sum / total).toFixed(1)));
          setReviewCount(total);
        }
      } catch (err) {
        console.error("Lỗi nạp đánh giá:", err);
      }
    }
    fetchDynamicRatings();
  }, [product.id]);

  useEffect(() => {
    addRecentlyViewed({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.variants[0]?.price ?? 0,
      imageUrl: product.images[0]?.url ?? "",
      imageAlt: product.images[0]?.alt ?? product.name,
    });
  }, [product, addRecentlyViewed]);

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  );
  if (!selectedVariant) return null;

  const currentStock =
    (product as { stock?: number }).stock ??
    selectedVariant.inventory.quantity ??
    0;
  const isOutOfStock = currentStock <= 0;

  const isOnSale = Boolean(
    selectedVariant.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price,
  );

  function handleAddToCart() {
    if (!selectedVariant || isOutOfStock) return;

    const finalVariantName = selectedColor
      ? `Màu: ${selectedColor.name}`
      : selectedVariant.name !== "Default Variant"
        ? selectedVariant.name
        : "Mặc định";

    addToCart({
      variantId: `${selectedVariant.id}-${selectedColor?.name || "default"}`,
      productId: product.id,
      name: product.name,
      variantName: finalVariantName,
      image: product.images[0] ?? { url: "", alt: product.name },
      slug: product.slug,
      price: selectedVariant.price,
      quantity,
    });
    openCart();
  }

  function handleAddAddonToCart(addon: Product) {
    const addonStock =
      (addon as { stock?: number }).stock ??
      addon.variants?.[0]?.inventory?.quantity ??
      0;
    if (addonStock <= 0) {
      toast.error("Sản phẩm này hiện đang hết hàng!");
      return;
    }

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
    if (!selectedVariant) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast("Đã xóa khỏi danh sách yêu thích");
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: selectedVariant.price,
        image: product.images[0] ?? { url: "", alt: product.name },
      });
      toast.success("Đã lưu vào danh sách yêu thích ✨");
    }
  }

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
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

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16 items-start pb-16 border-b border-[#E1DDD5]/60">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col text-left">
            <div>
              <StarRating rating={avgRating} reviewCount={reviewCount} />
            </div>

            {/* BADGES */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3 mb-1">
              {isOutOfStock && (
                <span className="text-[10px] font-mono font-bold text-white bg-slate-900 px-3 py-1 rounded-full uppercase tracking-wider shadow-xs border border-white/20">
                  🚫 HẾT HÀNG TẠM THỜI
                </span>
              )}

              {isOnSale && (
                <button
                  type="button"
                  onClick={() => router.push("/shop?sale=true")}
                  className="text-[9px] font-mono font-bold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  ⚡ GIẢM GIÁ
                </button>
              )}
              {product.featured && (
                <button
                  type="button"
                  onClick={() => router.push("/shop?sort=newest")}
                  className="text-[9px] font-mono font-bold text-black bg-[#FF9D00] hover:bg-amber-500 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  🔥 BÁN CHẠY
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black font-serif mt-1">
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

            {/* GIÁ BÁN */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mt-4 flex items-center gap-3 w-fit select-none"
            >
              <span className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-[#1E1C1A]">
                {formatPrice(selectedVariant.price, selectedVariant.currency)}
              </span>

              {isOnSale && selectedVariant.compareAtPrice && (
                <span className="text-base sm:text-lg font-mono text-slate-400 line-through font-medium">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}

              {isOnSale && selectedVariant.compareAtPrice && (
                <Badge className="bg-red-600 text-white font-bold text-xs font-mono uppercase px-2.5 py-1 rounded-md border-0 shadow-xs animate-pulse">
                  -
                  {Math.round(
                    (1 -
                      selectedVariant.price / selectedVariant.compareAtPrice) *
                      100,
                  )}
                  %
                </Badge>
              )}
            </motion.div>

            {/* 🎨 BỘ CHỌN NHIỀU MÀU SẮC TƯƠNG TÁC (CHỈ HIỆN KHI CÓ MÀU TRONG CSDL) */}
            {availableColors.length > 0 && (
              <div className="mt-5 p-4 rounded-3xl bg-white border border-[#E1DDD5] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="size-4 text-[#FF9D00]" />
                    <span className="text-xs font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                      Tùy chọn tông màu:
                    </span>
                    <span className="text-xs font-sans font-bold text-black">
                      {selectedColor?.name || "Mặc định"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                    Thủ công tinh gọn
                  </span>
                </div>

                {/* DANH SÁCH SWATCH MÀU */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {availableColors.map((col) => {
                    const isSelected = selectedColor?.name === col.name;
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-black bg-slate-900 text-white font-bold shadow-sm ring-2 ring-slate-900/20"
                            : "border-[#E1DDD5] bg-[#FCFAF2] text-slate-800 hover:border-slate-400"
                        }`}
                      >
                        <span
                          className="size-3.5 rounded-full border border-white/80 shadow-xs shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: col.hex }}
                        >
                          {isSelected && (
                            <Check className="size-2 text-white stroke-[3]" />
                          )}
                        </span>
                        <span className="text-xs font-sans">{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MÔ TẢ ĐỊNH DẠNG */}
            <div className="mt-5 pt-4 border-t border-[#E1DDD5]/60">
              <FormattedDescription text={product.description} />
            </div>

            {product.variants.length > 1 && (
              <div className="mt-6 mb-6">
                <VariantSelector
                  variants={product.variants}
                  selectedVariantId={selectedVariantId}
                  onSelect={setSelectedVariantId}
                />
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mt-6 border-b border-[#E1DDD5]/60 pb-8">
              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={currentStock > 0 ? currentStock : 1}
                  disabled={isOutOfStock}
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={
                    isWishlisted ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"
                  }
                  onClick={handleToggleWishlist}
                  className="rounded-xl border-[#E1DDD5] hover:bg-[#EAE5D9]/20"
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-wishlist text-wishlist" : ""}`}
                  />
                </Button>
              </div>

              {/* NÚT THÊM / KHÓA ORDER NẾU HẾT HÀNG */}
              <Button
                size="lg"
                aria-label={
                  isOutOfStock
                    ? "Sản phẩm hiện đang hết hàng tạm thời"
                    : "Thêm sản phẩm vào giỏ hàng"
                }
                className={`w-full sm:flex-1 font-mono uppercase text-xs tracking-wider rounded-xl py-4 flex items-center justify-center gap-2 transition-colors ${
                  isOutOfStock
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-200 border border-slate-300"
                    : "bg-black hover:bg-[#33302C] text-white cursor-pointer"
                }`}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                {isOutOfStock ? "🚫 HẾT HÀNG TẠM THỜI" : "THÊM VÀO GIỎ HÀNG"}
              </Button>
            </div>

            {isOutOfStock && (
              <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 font-sans leading-relaxed">
                <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Sản phẩm đang tạm hết hàng trong kho.</strong> Bạn có
                  thể liên hệ Zalo hotline{" "}
                  <a
                    href={`https://zalo.me/${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold text-black"
                  >
                    {siteConfig.contact.phone}
                  </a>{" "}
                  để đặt ưu tiên chế tác cho đợt tiếp theo.
                </div>
              </div>
            )}

            {/* UPSELL MUA KÈM (ĐÃ KHÓA NÚT NẾU HẾT HÀNG) */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 rounded-3xl p-6 bg-white border border-[#E1DDD5] flex flex-col gap-4 shadow-xs relative overflow-hidden">
                <div className="space-y-1 relative z-10 text-left">
                  <h4 className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">
                    Hoàn thiện không gian mộc mạc
                  </h4>
                  <p className="text-xs text-[#5C564E] font-sans">
                    Sản phẩm gợi ý mua kèm hoàn hảo cho góc làm việc tối giản.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5 relative z-10">
                  {relatedProducts.slice(0, 2).map((item) => {
                    const addonImgUrl =
                      typeof item.images?.[0] === "string"
                        ? item.images[0]
                        : item.images?.[0]?.url || PLACEHOLDER_IMAGE;
                    const addonVariant = item.variants?.[0];
                    const isAddonSale = Boolean(
                      addonVariant?.compareAtPrice &&
                      addonVariant.compareAtPrice > addonVariant.price,
                    );

                    const addonStock =
                      (item as { stock?: number }).stock ??
                      addonVariant?.inventory?.quantity ??
                      0;
                    const isAddonOutOfStock = addonStock <= 0;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-3.5 bg-[#FCFAF2]/50 border border-[#E1DDD5] rounded-2xl shadow-xs w-full"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-white shadow-xs">
                            <Image
                              src={addonImgUrl}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>

                          <div className="text-left min-w-0 flex-1">
                            <p className="text-xs font-serif font-bold text-black truncate leading-snug pr-2">
                              {item.name}
                            </p>
                            <div className="flex items-baseline gap-1.5 mt-1 font-mono text-xs">
                              <span className="font-bold text-black">
                                {addonVariant &&
                                  formatPrice(addonVariant.price)}
                              </span>
                              {isAddonSale && addonVariant?.compareAtPrice && (
                                <span className="text-slate-400 line-through text-[10px]">
                                  {formatPrice(addonVariant.compareAtPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isAddonOutOfStock ? (
                          <button
                            type="button"
                            disabled
                            aria-label={`${item.name} hiện đang hết hàng`}
                            className="rounded-lg bg-slate-200 text-slate-500 text-[9px] font-sans font-bold uppercase px-3 py-1.5 cursor-not-allowed select-none border border-slate-300"
                          >
                            Hết hàng
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddAddonToCart(item)}
                            aria-label={`Thêm ${item.name} vào giỏ hàng`}
                            className="rounded-lg bg-black hover:bg-[#33302C] text-[10px] font-sans font-bold text-white px-3.5 py-2 uppercase shadow-xs shrink-0 cursor-pointer transition-colors"
                          >
                            Thêm
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <TrustSignals />
          </div>
        </div>

        {/* BẢNG ĐẶC ĐIỂM HOÀN THIỆN */}
        <div className="py-16 border-b border-[#E1DDD5]/60 text-left">
          <div className="bg-black text-white p-4 rounded-2xl flex items-center max-w-full justify-between select-none mb-10 shadow-xs">
            <span className="font-serif text-lg font-bold pl-2">
              Đặc điểm hoàn thiện &amp; Không gian sống
            </span>
            <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase pr-2">
              Boo Space Signature
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-[#FAF5F2] border border-[#E1DDD5] rounded-3xl flex flex-col justify-between min-h-[160px]">
              <Feather className="size-6 text-[#FF9D00]" />
              <div className="space-y-1.5 mt-4">
                <h3 className="font-serif text-base font-bold text-black leading-none">
                  Chất liệu
                </h3>
                <p className="text-xs text-[#5C564E] leading-relaxed">
                  Chất liệu cao cấp an toàn, bền nhẹ và mang bề mặt nhám mờ lì mộc mạc tựa gốm nung.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#FAF5F2] border border-[#E1DDD5] rounded-3xl flex flex-col justify-between min-h-[160px]">
              <Sparkles className="size-6 text-[#FF9D00]" />
              <div className="space-y-1.5 mt-4">
                <h3 className="font-serif text-base font-bold text-black leading-none">
                  Cảm giác sống
                </h3>
                <p className="text-xs text-[#5C564E] leading-relaxed">
                  Không mùi sinh học, chống ẩm mốc tự nhiên, kháng nước &amp; dễ dàng lau sạch.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#FAF5F2] border border-[#E1DDD5] rounded-3xl flex flex-col justify-between min-h-[160px]">
              <Award className="size-6 text-[#FF9D00]" />
              <div className="space-y-1.5 mt-4">
                <h3 className="font-serif text-base font-bold text-black leading-none">
                  Công năng
                </h3>
                <p className="text-xs text-[#5C564E] leading-relaxed">
                  Thiết kế nguyên khối tinh xảo, hài hòa cùng ánh sáng và mảng xanh của phòng.
                </p>
              </div>
            </div>
          </div>
        </div>

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

        <RecentlyViewed excludeProductId={product.id} />
      </div>

      {/* MOBILE STICKY ADD-TO-CART BAR (LUXURY COZY LEIGH UX) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FCFAF2]/95 backdrop-blur-md border-t border-[#E1DDD5] px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {product.images[0]?.url && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#E1DDD5] bg-white">
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-serif font-bold text-black truncate leading-tight">
              {product.name}
            </p>
            <p className="text-xs font-mono font-bold text-[#1E1C1A]">
              {formatPrice(selectedVariant.price, selectedVariant.currency)}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          aria-label={
            isOutOfStock
              ? "Sản phẩm hiện đang hết hàng tạm thời"
              : "Thêm sản phẩm vào giỏ hàng"
          }
          className={`shrink-0 font-mono uppercase text-[11px] tracking-wider rounded-xl px-4 py-2 flex items-center gap-1.5 transition-colors ${
            isOutOfStock
              ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
              : "bg-black hover:bg-[#33302C] text-white cursor-pointer"
          }`}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {isOutOfStock ? "HẾT HÀNG" : "THÊM"}
        </Button>
      </div>
    </div>
  );
}

// BỔ SUNG CẢ DEFAULT EXPORT DỰ PHÒNG ĐỂ TƯƠNG THÍCH MỌI CÁCH IMPORT
export default ProductDetailView;
