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
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/lib/supabase/client";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config";
import type { Order } from "@/types";
import {
  ShoppingBag,
  HelpCircle,
  Loader2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

// Hàm định dạng tiền tệ Việt Nam (VND) trực tiếp để tránh lỗi chênh lệch chia 100
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
  const removeItem = useCartStore((s) => s.removeItem); // Lấy hàm xóa sản phẩm khỏi giỏ hàng từ Store

  // Các thông tin tài khoản đang đăng nhập
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Quản lý cổng thanh toán lựa chọn: "cod" (Thanh toán khi nhận hàng) hoặc "vietqr" (Chuyển khoản QR)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vietqr">(
    "vietqr",
  );

  // Khởi tạo form với quốc gia mặc định là VN và đã bổ sung trường phone (số điện thoại), notes (ghi chú)
  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    state: "Việt Nam",
    postalCode: "",
    country: "VN",
    notes: "", // Trường ghi chú đơn hàng
  });

  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  // States quản lý Mã giảm giá đối chiếu Supabase
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // States quản lý sản phẩm gợi ý mua kèm (giới hạn 3 sản phẩm)
  const [addons, setAddons] = useState<any[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ĐỒNG BỘ: Tự động điền (Autofill) thông tin và sổ địa chỉ nếu tài khoản đã đăng nhập
  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      const defaultAddr =
        user.addresses?.find((a: any) => a.isDefault) || user.addresses?.[0];
      setForm({
        email: user.email || "",
        phone: defaultAddr?.phone || "",
        firstName: user.firstName || defaultAddr?.firstName || "",
        lastName: user.lastName || defaultAddr?.lastName || "",
        line1: defaultAddr?.line1 || "",
        line2: defaultAddr?.line2 || "",
        city: defaultAddr?.city || "",
        state: defaultAddr?.state || "Việt Nam",
        postalCode: defaultAddr?.postalCode || "",
        country: "VN",
        notes: "",
      });
    }
  }, [mounted, isAuthenticated, user]);

  // KÉO DỮ LIỆU SẢN PHẨM MUA KÈM (GIỚI HẠN 3 SẢN PHẨM PHỤ KIỆN) TỪ SUPABASE
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
          setAddons(data);
        }
      } catch (err) {
        console.error("Lỗi nạp sản phẩm mua kèm ở Checkout:", err);
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
            Vui lòng thêm một vài sản phẩm mộc/DIY trước khi thanh toán nhé ✨
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

  // ĐỐI CHIẾU MÃ GIẢM GIÁ TRÊN SUPABASE THỜI GIAN THỰC
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

  // Thêm nhanh sản phẩm gợi ý mua kèm vào giỏ hàng
  function handleAddAddonToCart(addon: any) {
    const itemInCart = items.find((i) => i.productId === addon.id);
    if (itemInCart) {
      toast("Sản phẩm này đã nằm trong danh sách mua của bạn rồi ✨");
      return;
    }

    addToCart({
      variantId: addon.id + "-default",
      productId: addon.id,
      name: addon.name,
      variantName: "Default Variant",
      image: { url: addon.images[0] || "", alt: addon.name },
      slug: addon.slug,
      price: addon.price * 100, // Nhân 100 để tương thích cấu trúc Client
      quantity: 1,
    });
    toast.success(`Đã thêm ${addon.name} vào đơn hàng của bạn!`);
  }

  // Xử lý gỡ bỏ sản phẩm trực quan ngay tại trang Checkout
  function handleRemoveItem(variantId: string, itemName: string) {
    removeItem(variantId);
    toast.success(`Đã gỡ bỏ ${itemName} ra khỏi đơn hàng`);
  }

  // Tính toán tổng tiền sau khi áp dụng mã giảm giá và Miễn phí vận chuyển
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shipping = 0; // Miễn phí vận chuyển toàn quốc tại Việt Nam
  const tax = 0;
  const total = subtotal - discountAmount + shipping + tax;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.email ||
      !form.phone ||
      !form.lastName ||
      !form.line1 ||
      !form.city
    ) {
      toast.error("Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc.");
      return;
    }

    setLoading(true);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Ép kiểu an toàn cho order để nạp các thuộc tính SĐT và phương thức thanh toán
    const order: any = {
      id: orderId,
      orderNumber: orderId,
      paymentMethod: paymentMethod === "vietqr" ? "VietQR" : "COD",
      payment_method: paymentMethod === "vietqr" ? "VietQR" : "COD",
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
      paymentStatus: paymentMethod === "vietqr" ? "pending" : "captured",
      subtotal: subtotal / 100,
      tax: tax,
      shipping: shipping,
      total: total / 100,
      currency: "VND",
      shippingAddress: {
        id: "addr-1",
        type: "shipping",
        firstName: form.firstName || "",
        lastName: form.lastName,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode.trim() || "100000",
        country: form.country,
        isDefault: true,
        phone: form.phone,
      },
      customerEmail: form.email,
      customerPhone: form.phone,
      customerName: `${form.lastName} ${form.firstName}`,
      notes: form.notes, // Gửi ghi chú đơn hàng lên API
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. GỬI ĐĂNG KÝ BẢN TIN NẾU KHÁCH CHECK "GỬI TIN TỨC"
      if (marketingOptIn) {
        fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        }).catch((err) => console.error("Lỗi đăng ký tiếp thị:", err));
      }

      // 2. LƯU LẠI SỔ ĐỊA CHỈ TRÊN SUPABASE NẾU CÓ ĐĂNG NHẬP & CHỌN "LƯU THÔNG TIN"
      if (isAuthenticated && user?.id && saveInfo) {
        const newAddress = {
          id: `addr-${Date.now()}`,
          firstName: form.firstName,
          lastName: form.lastName,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode || "100000",
          country: form.country,
          phone: form.phone,
          isDefault: true,
        };

        const { data: dbUser } = await supabase
          .from("users")
          .select("data")
          .eq("id", user.id)
          .single();

        if (dbUser) {
          const currentData = dbUser.data || {};
          const currentAddresses = currentData.addresses || [];

          const updatedAddresses = [
            newAddress,
            ...currentAddresses.map((a: any) => ({ ...a, isDefault: false })),
          ].slice(0, 5);

          const updatedData = {
            ...currentData,
            addresses: updatedAddresses,
          };

          await supabase
            .from("users")
            .update({
              data: updatedData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          updateProfile({ ...user, addresses: updatedAddresses } as any);
        }
      }

      // 3. TIẾN HÀNH TẠO ĐƠN HÀNG VÀ GỬI EMAIL THÔNG BÁO SONG SONG
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu đơn hàng.");
      }

      addOrder(order);
      clearCart();
      toast.success("Đặt hàng thành công ✨");
      router.push(`/checkout/success?order_id=${orderId}`);
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
      setLoading(false);
    }
  }

  // Lọc sạch sản phẩm gợi ý mua kèm: Không hiển thị sản phẩm đã nằm sẵn trong đơn hàng của khách
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
          {/* KHU VỰC ĐIỀN THÔNG TIN (CỘT TRÁI - CHIẾM 7/12 CHIỀU RỘNG CHUẨN SHOPIFY) */}
          <div className="space-y-8 lg:col-span-7">
            {/* Thông tin liên hệ */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm text-left">
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

            {/* Địa chỉ giao hàng bản địa hóa */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm text-left">
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
                    className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
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
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
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
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
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

            {/* KHU VỰC GHI CHÚ CHẾ TÁC & GIAO HÀNG ĐẶC BIỆT */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm text-left">
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
                    Yêu cầu thêm của bạn (Màu vỏ nhựa nhám, kích thước riêng,
                    hoặc lưu ý giao hàng...)
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="Ví dụ: Đóng gói cẩn thận giúp mình làm quà tặng, hoặc chọn vỏ đèn màu Matte Ivory..."
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl border border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium p-3 outline-none resize-none focus-visible:ring-1 focus-visible:ring-[#FF9D00]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* KHU VỰC THANH TOÁN (COD & VIETQR TỰ ĐỘNG) */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm text-left">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
                <CardTitle className="font-serif text-lg font-bold text-black">
                  Phương thức thanh toán &amp; Vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {/* 2 Khối chọn dẹt song song */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cổng 1: COD */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`border-2 rounded-2xl p-4 flex flex-col justify-between min-h-[120px] relative cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#FF9D00] bg-[#FCFAF2]/40"
                        : "border-[#E1DDD5] bg-white hover:border-[#CFCABF]"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span
                        className={`text-xs font-mono font-bold ${
                          paymentMethod === "cod"
                            ? "text-[#FF9D00]"
                            : "text-[#786F66]"
                        }`}
                      >
                        01 / COD
                      </span>
                      <span
                        className={`size-4 rounded-full border-4 ${
                          paymentMethod === "cod"
                            ? "border-[#FF9D00] bg-white"
                            : "border-[#CFCABF] bg-transparent"
                        }`}
                      />
                    </div>
                    <div className="space-y-1 mt-4">
                      <h4 className="font-serif text-sm font-bold text-black leading-tight">
                        Thanh toán khi nhận hàng
                      </h4>
                      <p className="text-[10px] font-sans text-[#786F66] leading-relaxed">
                        Thanh toán tiền mặt cho shipper ngay khi kiểm tra và
                        nhận hàng thành công.
                      </p>
                    </div>
                  </div>

                  {/* Cổng 2: VietQR (Kích hoạt chính thức) */}
                  <div
                    onClick={() => setPaymentMethod("vietqr")}
                    className={`border-2 rounded-2xl p-4 flex flex-col justify-between min-h-[120px] relative cursor-pointer transition-all ${
                      paymentMethod === "vietqr"
                        ? "border-[#FF9D00] bg-[#FCFAF2]/40"
                        : "border-[#E1DDD5] bg-white hover:border-[#CFCABF]"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span
                        className={`text-xs font-mono font-bold ${
                          paymentMethod === "vietqr"
                            ? "text-[#FF9D00]"
                            : "text-[#786F66]"
                        }`}
                      >
                        02 / VIETQR
                      </span>
                      <span
                        className={`size-4 rounded-full border-4 ${
                          paymentMethod === "vietqr"
                            ? "border-[#FF9D00] bg-white"
                            : "border-[#CFCABF] bg-transparent"
                        }`}
                      />
                    </div>
                    <div className="space-y-1 mt-4">
                      <h4 className="font-serif text-sm font-bold text-black flex items-center gap-1.5 leading-tight">
                        Chuyển khoản VietQR
                      </h4>
                      <p className="text-[10px] font-sans text-[#786F66] leading-relaxed">
                        Quét mã QR tự động qua ứng dụng ngân hàng, xác nhận tức
                        thì 24/7.
                      </p>
                    </div>
                  </div>
                </div>

                {/* KHUNG HƯỚNG DẪN THANH TOÁN THAY ĐỔI THEO PHƯƠNG THỨC ĐƯỢC CHỌN */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-black">
                      Thanh toán
                    </h3>
                    <p className="text-[11px] text-[#786F66] font-sans leading-none">
                      Toàn bộ các giao dịch được bảo mật và mã hóa.
                    </p>
                  </div>

                  {paymentMethod === "cod" ? (
                    <div className="border border-[#CFCABF] rounded-xl overflow-hidden bg-white text-left">
                      <div className="p-4 bg-[#FAF5F2]/60 border-b border-[#E1DDD5] flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-black">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                      </div>
                      <div className="p-5 bg-[#FCFAF2]/30 text-xs leading-relaxed text-[#5c544d] font-sans space-y-2.5">
                        <p className="font-bold text-black flex items-center gap-1.5">
                          <span>✓</span> Áp dụng giao hàng và thu tiền tận nơi
                          trên toàn quốc.
                        </p>
                        <p className="font-bold text-[#3ECF8E] flex items-center gap-1.5">
                          <span>✓</span> Miễn phí vận chuyển cho mọi đơn hàng
                          tại Việt Nam.
                        </p>
                        <p className="italic text-[#786F66] leading-relaxed">
                          Bạn chỉ cần kiểm tra chất lượng sản phẩm mộc/DIY khi
                          nhận được từ shipper và thanh toán đúng số tiền hàng
                          cho shipper, không chịu thêm bất kỳ chi phí phát sinh
                          nào khác ✨
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-[#CFCABF] rounded-xl overflow-hidden bg-white text-left">
                      <div className="p-4 bg-[#FAF5F2]/60 border-b border-[#E1DDD5] flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-black">
                          Chuyển khoản VietQR tự động
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#FF9D00] uppercase tracking-wider">
                          Xác nhận tức thì 24/7
                        </span>
                      </div>
                      <div className="p-5 bg-[#FCFAF2]/30 text-xs leading-relaxed text-[#5c544d] font-sans space-y-2.5">
                        <p className="font-bold text-black flex items-center gap-1.5">
                          <span>✓</span> Mã QR tự động điền sẵn số tiền và nội
                          dung chuyển khoản.
                        </p>
                        <p className="font-bold text-[#3ECF8E] flex items-center gap-1.5">
                          <span>✓</span> Hệ thống tự đối soát ngân hàng và kích
                          hoạt lệnh sản xuất trong 30 giây.
                        </p>
                        <p className="italic text-[#786F66] leading-relaxed">
                          Sau khi nhấn "Thanh toán ngay", mã QR VietQR sẽ xuất
                          hiện để bạn quét thanh toán trực tiếp qua App ngân
                          hàng ✨
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NÚT THANH TOÁN CHO THIẾT BỊ DI ĐỘNG (MOBILE) - HIỆN TRÊN MOBILE, ẨN TRÊN DESKTOP */}
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

          {/* TÓM TẮT ĐƠN HÀNG (CỘT PHẢI - CHIẾM 5/12 CHIỀU RỘNG CHUẨN SHOPIFY) */}
          <div className="lg:col-span-5">
            <Card className="sticky top-24 rounded-3xl border border-[#DCD6CC] bg-[#FAF5F2]/90 p-6 shadow-md space-y-6">
              <CardHeader className="p-0 pb-3 border-b border-[#E1DDD5]/60">
                <CardTitle className="font-serif text-lg font-bold text-black text-left">
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                {/* Danh sách sản phẩm kèm Thumbnail & Nút Gỡ sản phẩm dẹt */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#EAE5D9]">
                  {items.map((item) => {
                    const imgUrl = item.image?.url || PLACEHOLDER_IMAGE;
                    const imgAlt = item.image?.alt || item.name;

                    return (
                      <div
                        key={item.variantId}
                        className="flex items-center gap-4 pb-3.5 border-b border-[#E1DDD5]/60 last:border-0 last:pb-0 relative group"
                      >
                        {/* Ảnh thu nhỏ đại diện kèm badge số lượng */}
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

                        {/* Tên sản phẩm & Số lượng */}
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
                          <span className="text-xs sm:text-sm font-mono font-medium text-black">
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

                {/* Ô Nhập Mã giảm giá lồng nút Áp dụng dẹt kết nối trực tiếp */}
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Mã giảm giá (ví dụ: BOOSPACE10)"
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

                {/* GỢI Ý MUA KÈM ƯU ĐÃI (COMPLETE YOUR SETUP - GIỚI HẠN 3 ITEMS) */}
                {filteredAddons.length > 0 && (
                  <div className="bg-white border border-[#E1DDD5] rounded-3xl p-5 space-y-4 shadow-sm text-left">
                    <div className="space-y-0.5 border-b border-[#E1DDD5]/40 pb-2">
                      <h4 className="font-serif text-sm font-bold text-black">
                        Complete your Setup
                      </h4>
                      <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                        Sản phẩm gợi ý cho góc làm việc của bạn
                      </p>
                    </div>

                    {addonsLoading ? (
                      <div className="flex justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredAddons.slice(0, 3).map((addon) => {
                          const imgUrl = addon.images[0] || PLACEHOLDER_IMAGE;
                          const isAddonSale =
                            addon.compare_price &&
                            addon.compare_price > addon.price;

                          return (
                            <div
                              key={addon.id}
                              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FCFAF2]/50 border border-[#E1DDD5]/60 hover:border-black/5 transition-all"
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
                                    {isAddonSale && (
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
                                className="rounded-lg bg-black hover:bg-[#33302C] text-[8px] font-mono font-bold tracking-widest text-white px-3 py-1.5 uppercase shadow-sm shrink-0 cursor-pointer transition-colors"
                              >
                                ADD +
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <Separator className="bg-[#E1DDD5]" />

                {/* Bảng kê tổng các chi phí sau chiết khấu */}
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
                        Giảm giá (${appliedCoupon} - ${discountPercent}%)
                      </span>
                      <span className="font-mono font-bold">
                        -{formatVND(discountAmount / 100)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#5c544d]">
                    <span className="flex items-center gap-1.5">
                      Vận chuyển{" "}
                      <HelpCircle className="h-3.5 w-3.5 text-[#786F66] cursor-help" />
                    </span>
                    <span className="font-mono font-bold text-[#3ECF8E] tracking-wider">
                      MIỄN PHÍ VẬN CHUYỂN
                    </span>
                  </div>

                  <Separator className="bg-[#E1DDD5]/60 my-2" />

                  <div className="flex justify-between items-center text-sm font-serif font-bold text-black pt-1">
                    <span>Tổng cộng đơn hàng</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-mono text-[#786F66] font-normal uppercase">
                        VND
                      </span>
                      <span className="font-mono text-lg text-black">
                        {formatVND(total / 100)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* NÚT THANH TOÁN CHO DESKTOP - HIỆN TRÊN DESKTOP, ẨN TRÊN MOBILE */}
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
