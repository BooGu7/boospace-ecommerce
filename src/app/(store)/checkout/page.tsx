"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";
import { CartSummary } from "@/components/cart/cart-summary";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config";
import type { Order } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Khởi tạo form với quốc gia mặc định là VN
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "VN",
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FCFAF2] text-[#1E1C1A]">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-black">
          Thanh toán
        </h1>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FCFAF2] text-[#1E1C1A]">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-black">
          Thanh toán
        </h1>

        <div className="mt-16 text-center space-y-6">
          <p className="text-sm font-sans text-[#5c544d] leading-relaxed">
            Giỏ hàng của bạn đang trống. Hãy thêm một vài sản phẩm trước khi
            thanh toán nhé ✨
          </p>

          <Button
            className="rounded-xl bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs font-bold tracking-wider py-4 px-6"
            asChild
          >
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.line1 ||
      !form.city ||
      !form.state
    ) {
      toast.error("Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc.");
      return;
    }

    setLoading(true);

    const freeShippingThresholdCents = 500000 * 100;
    const standardShippingCents = 30000 * 100;

    const shipping =
      subtotal >= freeShippingThresholdCents ? 0 : standardShippingCents;
    const tax = Math.round(subtotal * (siteConfig.taxRate || 0));
    const total = subtotal + shipping + tax;
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order: Order = {
      id: orderId,
      orderNumber: orderId,
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        variantName: item.variantName,
        sku: "",
        image: item.image,
        price: item.price / 100,
        quantity: item.quantity,
        total: item.lineTotal / 100,
      })),
      status: "processing",
      paymentStatus: "captured",
      subtotal: subtotal / 100,
      tax: tax / 100,
      shipping: shipping / 100,
      total: total / 100,
      currency: "VND",
      shippingAddress: {
        id: "addr-1",
        type: "shipping",
        firstName: form.firstName,
        lastName: form.lastName,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode.trim() || "100000",
        country: form.country,
        isDefault: true,
      },
      customerEmail: form.email,
      customerName: `${form.lastName} ${form.firstName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      setLoading(false);
      toast.error("Không thể ghi nhận đơn hàng. Vui lòng thử lại sau.");
      return;
    }

    addOrder(order);
    clearCart();
    toast.success("Đặt hàng thành công ✨");
    router.push(`/checkout/success?order_id=${orderId}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FCFAF2] text-[#1E1C1A]">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black border-b border-[#E1DDD5] pb-6">
        Thanh toán đơn hàng
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* KHU VỰC ĐIỀN THÔNG TIN (CỘT TRÁI) */}
        <div className="space-y-8 lg:col-span-3">
          {/* Thông tin liên hệ */}
          <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm">
            <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
              <CardTitle className="font-serif text-lg font-bold text-black">
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                >
                  Địa chỉ Email nhận thông báo
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                />
              </div>
            </CardContent>
          </Card>

          {/* Địa chỉ giao hàng bản địa hóa */}
          <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm">
            <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
              <CardTitle className="font-serif text-lg font-bold text-black">
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                  >
                    Họ của bạn
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Nguyễn"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                  >
                    Tên của bạn
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Văn An"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="line1"
                  className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                >
                  Địa chỉ nhận hàng (Số nhà, tên đường...)
                </Label>
                <Input
                  id="line1"
                  name="line1"
                  placeholder="Ví dụ: 123 Đường Ba Tháng Hai, Phường 12"
                  value={form.line1}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="line2"
                  className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                >
                  Ghi chú địa chỉ (Căn hộ, tòa nhà, phòng...)
                </Label>
                <Input
                  id="line2"
                  name="line2"
                  placeholder="Không bắt buộc"
                  value={form.line2}
                  onChange={handleChange}
                  className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                  >
                    Quận / Huyện
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Quận 10"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                  >
                    Tỉnh / Thành phố
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="TP. Hồ Chí Minh"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="postalCode"
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                  >
                    Mã bưu chính
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="700000"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hướng dẫn thanh toán COD thực tế Việt Nam */}
          <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm">
            <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
              <CardTitle className="font-serif text-lg font-bold text-black">
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm leading-relaxed text-[#5c544d] font-sans">
                Hệ thống áp dụng phương thức **Thanh toán khi nhận hàng (COD)**
                tận nơi trên toàn quốc. Bạn chỉ cần kiểm tra chất lượng sản phẩm
                in 3D / thủ công khi nhận được từ shipper và thanh toán trực
                tiếp cho shipper ✨
              </p>
            </CardContent>
          </Card>
        </div>

        {/* TÓM TẮT ĐƠN HÀNG (CỘT PHẢI - BỔ SUNG ẢNH SẢN PHẨM & CHỮ RÕ NÉT) */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24 rounded-3xl border border-[#DCD6CC] bg-[#FAF5F2]/90 p-6 shadow-md space-y-6">
            <CardHeader className="p-0 pb-3 border-b border-[#E1DDD5]/60">
              <CardTitle className="font-serif text-lg font-bold text-black">
                Tóm tắt đơn hàng
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              {/* Danh sách sản phẩm kèm Thumbnail dẹt tinh xảo */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#EAE5D9]">
                {items.map((item) => {
                  // Xử lý link ảnh động
                  const imgUrl = item.image?.url || PLACEHOLDER_IMAGE;
                  const imgAlt = item.image?.alt || item.name;

                  return (
                    <div
                      key={item.variantId}
                      className="flex items-center gap-4 pb-3.5 border-b border-[#E1DDD5]/60 last:border-0 last:pb-0"
                    >
                      {/* Ảnh thu nhỏ đại diện */}
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-sm">
                        <Image
                          src={imgUrl}
                          alt={imgAlt}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      {/* Tên sản phẩm & Số lượng rõ ràng */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs sm:text-sm font-serif font-bold text-black leading-snug truncate">
                          {item.name}
                        </p>
                        {item.variantName &&
                          item.variantName !== "Default Variant" && (
                            <p className="text-[10px] text-[#786F66] font-sans font-medium mt-0.5 truncate">
                              Phân loại: {item.variantName}
                            </p>
                          )}
                        <span className="text-[10px] font-mono text-[#5c544d] bg-[#EAE5D9]/50 px-2 py-0.5 rounded-md mt-1.5 inline-block font-semibold">
                          Số lượng: {item.quantity}
                        </span>
                      </div>

                      {/* Giá tiền của sản phẩm */}
                      <span className="shrink-0 text-xs sm:text-sm font-mono font-bold text-black">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator className="bg-[#E1DDD5]" />

              {/* Bảng tính toán tổng tiền */}
              <CartSummary subtotal={subtotal} />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer"
                disabled={loading}
              >
                {loading ? "Đang ghi nhận..." : "Xác nhận đặt hàng"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
