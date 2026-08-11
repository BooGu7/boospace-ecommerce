"use client";

import { Banknote, HelpCircle, Loader2, QrCode, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";

interface AddonProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  compare_price?: number;
}

interface UserAddress {
  id?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  line1?: string;
  line2?: string;
  district?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  formattedAddress?: string;
}

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const addToCart = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vietqr">(
    "vietqr",
  );

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    district: "",
    city: "TP. Hồ Chí Minh",
    state: "Việt Nam",
    postalCode: "700000",
    country: "VN",
    notes: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const [addons, setAddons] = useState<AddonProduct[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      const userAddresses = (user.addresses || []) as UserAddress[];
      const defaultAddr =
        userAddresses.find((a) => a.isDefault) || userAddresses[0];

      setForm({
        email: user.email || "",
        phone: defaultAddr?.phone || (user as { phone?: string }).phone || "",
        firstName: user.firstName || defaultAddr?.firstName || "",
        lastName: user.lastName || defaultAddr?.lastName || "",
        line1: defaultAddr?.line1 || "",
        line2: defaultAddr?.line2 || "",
        district: defaultAddr?.district || defaultAddr?.city || "",
        city: defaultAddr?.city || "TP. Hồ Chí Minh",
        state: defaultAddr?.state || "Việt Nam",
        postalCode: defaultAddr?.postalCode || "700000",
        country: "VN",
        notes: "",
      });
    }
  }, [mounted, isAuthenticated, user]);

  useEffect(() => {
    if (!mounted) return;

    async function fetchCheckoutAddons() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, images, compare_price")
          .eq("published", true)
          .limit(3);

        if (!error && data) {
          setAddons(data as AddonProduct[]);
        }
      } catch (err) {
        console.error("Lỗi nạp sản phẩm mua kèm:", err);
      } finally {
        setAddonsLoading(false);
      }
    }

    fetchCheckoutAddons();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center">
        <Loader2 className="size-6 rounded-full border-2 border-[#E1DDD5] border-t-[#FF9D00] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center">
        <div className="mx-auto max-w-3xl px-4 py-32 text-center text-[#1E1C1A] space-y-6">
          <h1 className="font-serif text-3xl font-bold">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-sm font-sans text-[#786F66]">
            Vui lòng thêm một vài sản phẩm chế tác custom trước khi thanh toán
            nhé ✨
          </p>
          <Button
            className="rounded-xl bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs font-bold tracking-wider py-4 px-6 cursor-pointer"
            asChild
          >
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();

  const isHCM =
    form.city.toLowerCase().includes("hồ chí minh") ||
    form.city.toLowerCase().includes("hcm");
  const shippingFee = isHCM ? 0 : siteConfig.shipping.standardFee;

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const tax = 0;
  const total = subtotal - discountAmount + shippingFee * 100 + tax;

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("active", true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setDiscountPercent(data.discount_percent);
        setAppliedCoupon(data.code);
        toast.success(
          `Áp dụng mã ${data.code} giảm ${data.discount_percent}% thành công! ✨`,
        );
      } else {
        toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi trong quá trình xác thực mã.");
    } finally {
      setApplying(false);
    }
  }

  function handleAddAddonToCart(addon: AddonProduct) {
    const itemInCart = items.find((i) => i.productId === addon.id);
    if (itemInCart) {
      toast("Sản phẩm này đã nằm trong danh sách mua của bạn rồi ✨");
      return;
    }

    addToCart({
      variantId: `${addon.id}-default`,
      productId: addon.id,
      name: addon.name,
      variantName: "Default Variant",
      image: { url: addon.images?.[0] || "", alt: addon.name },
      slug: addon.slug,
      price: addon.price * 100,
      quantity: 1,
    });
    toast.success(`Đã thêm ${addon.name} vào đơn hàng của bạn!`);
  }

  function handleRemoveItem(variantId: string, itemName: string) {
    removeItem(variantId);
    toast.success(`Đã gỡ bỏ ${itemName} ra khỏi đơn hàng`);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanEmail = form.email.trim().toLowerCase();
    if (
      !cleanEmail ||
      !form.phone ||
      !form.lastName ||
      !form.line1 ||
      !form.district ||
      !form.city
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng bắt buộc.");
      return;
    }

    setLoading(true);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const formattedAddressStr = `${form.line1}${form.line2 ? `, ${form.line2}` : ""}, ${form.district}, ${form.city}, ${form.state}`;

    const fullAddressObj: UserAddress = {
      id: `addr-${Date.now()}`,
      firstName: form.firstName || "",
      lastName: form.lastName,
      line1: form.line1,
      line2: form.line2 || "",
      district: form.district,
      city: form.city,
      state: form.state || "Việt Nam",
      postalCode: form.postalCode.trim() || "700000",
      country: "VN",
      phone: form.phone,
      formattedAddress: formattedAddressStr,
    };

    let validCustomerId: string | null = null;

    if (isAuthenticated && user?.id) {
      try {
        const { data: dbUser } = await supabase
          .from("users")
          .select("data")
          .eq("id", user.id)
          .maybeSingle();

        const currentData = dbUser?.data || {};
        const currentAddresses = (currentData.addresses || []) as UserAddress[];

        const updatedAddresses = [
          fullAddressObj,
          ...currentAddresses.map((a) => ({ ...a, isDefault: false })),
        ].slice(0, 5);

        const { error: upsertUserError } = await supabase.from("users").upsert({
          id: user.id,
          email: cleanEmail,
          data: {
            ...currentData,
            firstName: form.firstName || user.firstName || "",
            lastName: form.lastName || user.lastName || "",
            phone: form.phone,
            addresses: updatedAddresses,
          },
          updated_at: new Date().toISOString(),
        });

        if (!upsertUserError) {
          validCustomerId = user.id;
          updateProfile({
            ...user,
            addresses: updatedAddresses,
          } as unknown as typeof user);
        }
      } catch (err) {
        console.warn(
          "Chưa thể đồng bộ user vào public.users, khởi tạo dưới dạng đơn vãng lai:",
          err,
        );
      }
    }

    // ĐỒNG BỘ NẠP ĐẦY ĐỦ CẢ CAMELCASE VÀ SNAKE_CASE
    const orderPayload = {
      code: orderId,
      orderNumber: orderId,
      customerId: validCustomerId,
      customer_id: validCustomerId,
      customerName: `${form.lastName} ${form.firstName}`.trim(),
      customer_name: `${form.lastName} ${form.firstName}`.trim(),
      customerEmail: cleanEmail,
      customer_email: cleanEmail,
      customerPhone: form.phone.trim(),
      customer_phone: form.phone.trim(),
      customer_address: formattedAddressStr,
      shippingAddress: fullAddressObj,
      shipping_address: fullAddressObj,
      paymentMethod: paymentMethod === "vietqr" ? "VietQR" : "COD",
      payment_method: paymentMethod === "vietqr" ? "VietQR" : "COD",
      couponCode: couponCode.trim(),
      items: items.map((item) => ({
        productId: item.productId,
        product_id: item.productId,
        variantId: item.variantId,
        name: item.name,
        variantName: item.variantName,
        price: item.price / 100,
        unit_price: item.price / 100,
        quantity: item.quantity,
        total: item.lineTotal / 100,
        total_price: item.lineTotal / 100,
      })),
      subtotal: subtotal / 100,
      shipping: shippingFee,
      total: total / 100,
      notes: form.notes || "",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Không thể lưu đơn hàng.");
      }

      addOrder(orderPayload as unknown as Parameters<typeof addOrder>[0]);
      clearCart();
      toast.success("Đặt hàng thành công ✨");
      router.push(`/checkout/success?order_id=${orderId}`);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra, vui lòng thử lại sau.";
      console.error("[CHECKOUT_SUBMIT_ERROR]", err);
      toast.error(errorMsg);
      setLoading(false);
    }
  }

  const checkoutProductIds = new Set(items.map((i) => i.productId));
  const filteredAddons = addons.filter((a) => !checkoutProductIds.has(a.id));

  return (
    <div className="bg-[#FCFAF2] min-h-screen w-full relative">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50 text-[#1E1C1A]">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black border-b border-[#E1DDD5] pb-6 text-left">
          Thanh toán đơn hàng
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          <div className="space-y-8 lg:col-span-7">
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
                <CardTitle className="font-serif text-lg font-bold text-black">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
                    >
                      Số điện thoại liên hệ
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="09xx xxx xxx"
                      required
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
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
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
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
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
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
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
                  >
                    Địa chỉ nhận hàng (Số nhà, tên đường...)
                  </Label>
                  <Input
                    id="line1"
                    name="line1"
                    placeholder="Ví dụ: 123 Đường Ba Tháng Hai"
                    value={form.line1}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="district"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
                    >
                      Quận / Huyện
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Quận 10"
                      value={form.district}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
                    >
                      Tỉnh / Thành phố
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="TP. Hồ Chí Minh"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="postalCode"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
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

            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
                <CardTitle className="font-serif text-lg font-bold text-black">
                  Ghi chú chế tác &amp; Giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
                  >
                    Yêu cầu thêm của bạn (Màu vỏ nhám mờ, kích thước riêng...)
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Ví dụ: Đóng gói cẩn thận giúp mình làm quà tặng..."
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl border border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium p-3 outline-none resize-none focus-visible:ring-1 focus-visible:ring-[#FF9D00]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
                <CardTitle className="font-serif text-lg font-bold text-black">
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`border-2 rounded-2xl p-4 flex flex-col justify-between min-h-[130px] relative cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#FF9D00] bg-[#FCFAF2]/40"
                        : "border-[#E1DDD5] bg-white hover:border-[#CFCABF]"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-mono font-bold text-[#786F66] flex items-center gap-1.5">
                        <Banknote className="size-4 text-emerald-600" /> 01 /
                        COD
                      </span>
                      <span
                        className={`size-4 rounded-full border-4 ${
                          paymentMethod === "cod"
                            ? "border-[#FF9D00] bg-white"
                            : "border-[#CFCABF] bg-transparent"
                        }`}
                      />
                    </div>
                    <div className="space-y-1 mt-3">
                      <h4 className="font-serif text-sm font-bold text-black leading-tight">
                        Thanh toán khi nhận hàng
                      </h4>
                      <p className="text-[10px] font-sans text-[#786F66] leading-relaxed">
                        Thanh toán tiền mặt cho shipper ngay khi kiểm tra và
                        nhận hàng thành công.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("vietqr")}
                    className={`border-2 rounded-2xl p-4 flex flex-col justify-between min-h-[130px] relative cursor-pointer transition-all ${
                      paymentMethod === "vietqr"
                        ? "border-[#FF9D00] bg-[#FCFAF2]/40"
                        : "border-[#E1DDD5] bg-white hover:border-[#CFCABF]"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-mono font-bold text-[#FF9D00] flex items-center gap-1.5">
                        <QrCode className="size-4 text-[#FF9D00]" /> 02 / VIETQR
                      </span>
                      <span
                        className={`size-4 rounded-full border-4 ${
                          paymentMethod === "vietqr"
                            ? "border-[#FF9D00] bg-white"
                            : "border-[#CFCABF] bg-transparent"
                        }`}
                      />
                    </div>
                    <div className="space-y-1 mt-3">
                      <h4 className="font-serif text-sm font-bold text-black leading-tight">
                        Chuyển khoản VietQR
                      </h4>
                      <p className="text-[10px] font-sans text-[#786F66] leading-relaxed">
                        Quét mã QR tự động qua ứng dụng ngân hàng, xác nhận tức
                        thì 24/7.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <Video className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Lưu ý quan trọng:</strong> Quý khách vui lòng{" "}
                      <strong>quay video / chụp hình</strong> quá trình mở hộp
                      khi nhận hàng từ shipper để làm căn cứ đối soát hỗ trợ đổi
                      trả nếu sản phẩm có sự cố trong quá trình vận chuyển.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pt-4 block lg:hidden">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                {loading ? "Đang ghi nhận..." : "Thanh toán ngay"}
              </Button>
            </div>
          </div>

          {/* CỘT PHẢI - TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:col-span-5">
            <Card className="sticky top-24 rounded-3xl border border-[#DCD6CC] bg-[#FAF5F2]/90 p-6 shadow-md space-y-6">
              <CardHeader className="p-0 pb-3 border-b border-[#E1DDD5]/60">
                <CardTitle className="font-serif text-lg font-bold text-black text-left">
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#EAE5D9]">
                  {items.map((item) => {
                    const imgUrl = item.image?.url || PLACEHOLDER_IMAGE;
                    const imgAlt = item.image?.alt || item.name;

                    return (
                      <div
                        key={item.variantId}
                        className="flex items-center gap-4 pb-3.5 border-b border-[#E1DDD5]/60 last:border-0 last:pb-0 relative group"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-sm">
                          <Image
                            src={imgUrl}
                            alt={imgAlt}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white text-[9px] font-mono font-bold flex items-center justify-center rounded-full shadow-md">
                            {item.quantity}
                          </span>
                        </div>

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
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="text-xs sm:text-sm font-mono text-medium text-black">
                            {formatVND(item.lineTotal / 100)}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveItem(item.variantId, item.name)
                            }
                            className="text-[10px] font-mono font-bold text-[#786F66] hover:text-red-500 transition-colors uppercase cursor-pointer"
                          >
                            Gỡ bỏ
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-[#E1DDD5]" />

                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Mã giảm giá (ví dụ: BOOSPACE)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 h-11 rounded-lg border border-[#CFCABF] bg-white px-4 text-xs font-sans text-black focus:border-[#FF9D00]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applying || !couponCode.trim()}
                    className="rounded-lg bg-[#EAE5D9]/40 border border-[#CFCABF] text-black font-mono uppercase text-[10px] font-bold tracking-wider px-5 py-3 cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[80px]"
                  >
                    {applying ? (
                      <Loader2 className="h-3 w-3 animate-spin text-black" />
                    ) : (
                      "Áp dụng"
                    )}
                  </button>
                </div>

                <Separator className="bg-[#E1DDD5]" />

                {filteredAddons.length > 0 && (
                  <div className="bg-white border border-[#E1DDD5] rounded-3xl p-5 space-y-4 shadow-sm text-left">
                    <div className="space-y-0.5 border-b border-[#E1DDD5]/40 pb-2">
                      <h4 className="font-serif text-sm font-bold text-black">
                        Hoàn thiện không gian mộc mạc
                      </h4>
                      <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                        Sản phẩm gợi ý cho góc làm việc
                      </p>
                    </div>

                    {addonsLoading ? (
                      <div className="flex justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredAddons.slice(0, 3).map((addon) => {
                          const imgUrl = addon.images?.[0] || PLACEHOLDER_IMAGE;
                          const isAddonSale =
                            Boolean(addon.compare_price) &&
                            (addon.compare_price ?? 0) > addon.price;

                          return (
                            <div
                              key={addon.id}
                              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FCFAF2]/50 border border-[#E1DDD5]/60 transition-all"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-white shadow-inner">
                                  <Image
                                    src={imgUrl}
                                    alt={addon.name}
                                    fill
                                    sizes="44px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="text-left space-y-0.5 min-w-0">
                                  <h5 className="font-serif text-[11px] font-bold text-black truncate max-w-[120px]">
                                    {addon.name}
                                  </h5>
                                  <div className="flex items-baseline gap-1.5 font-mono text-[9px]">
                                    <span className="font-bold text-black">
                                      {formatVND(addon.price)}
                                    </span>
                                    {isAddonSale && addon.compare_price && (
                                      <span className="text-[#786F66] line-through opacity-60">
                                        {formatVND(addon.compare_price)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddAddonToCart(addon)}
                                className="rounded-lg bg-black hover:bg-[#33302C] text-[9px] font-sans font-bold text-white px-3 py-1.5 uppercase shadow-sm shrink-0 cursor-pointer transition-colors"
                              >
                                Thêm
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <Separator className="bg-[#E1DDD5]" />

                <div className="space-y-3.5 text-xs font-sans text-left">
                  <div className="flex justify-between text-[#5c544d]">
                    <span>Tổng phụ</span>
                    <span className="font-mono font-medium text-black">
                      {formatVND(subtotal / 100)}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-[#E26E67] font-medium">
                      <span>
                        Giảm giá ({appliedCoupon} - {discountPercent}%)
                      </span>
                      <span className="font-mono font-bold">
                        -{formatVND(discountAmount / 100)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#5c544d]">
                    <span className="flex items-center gap-1.5">
                      Phí vận chuyển
                      <HelpCircle className="h-3.5 w-3.5 text-[#786F66] cursor-help" />
                    </span>
                    <span className="font-mono font-bold tracking-wider">
                      {isHCM ? (
                        <span className="text-[#3ECF8E]">
                          MIỄN PHÍ VẬN CHUYỂN (HCM)
                        </span>
                      ) : (
                        <span className="text-black">
                          {formatVND(shippingFee)}
                        </span>
                      )}
                    </span>
                  </div>

                  <Separator className="bg-[#E1DDD5]/60 my-2" />

                  <div className="flex justify-between items-center text-sm font-serif font-bold text-black pt-1">
                    <span>Tổng cộng đơn hàng</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-mono text-[#786F66] font-normal uppercase">
                        VND
                      </span>
                      <span className="font-mono text-lg text-[#FF9D00]">
                        {formatVND(total / 100)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 hidden lg:block">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors shadow-sm"
                  >
                    {loading ? "Đang ghi nhận..." : "Thanh toán ngay"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
