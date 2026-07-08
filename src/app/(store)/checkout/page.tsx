"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";
import { useAuthStore } from "@/store/auth"; // Kết nối với Store xác thực tài khoản
import { supabase } from "@/lib/supabase/client"; // Kết nối client Supabase thời gian thực
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config";
import { ShoppingBag, HelpCircle, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrdersStore((s) => s.addOrder);

  // Các thông tin tài khoản đang đăng nhập
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Khởi tạo form với quốc gia mặc định là VN và đã bổ sung trường phone (số điện thoại)
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
  });

  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  // States quản lý Mã giảm giá đối chiếu Supabase
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => setMounted(true), []);

  // ĐỒNG BỘ: Tự động điền (Autofill) thông tin và sổ địa chỉ nếu tài khoản đã đăng nhập
  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      // Tìm địa chỉ mặc định trong hồ sơ khách hàng để điền trước
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
      });
    }
  }, [mounted, isAuthenticated, user]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center">
        <Loader2 className="size-6 rounded-full border-2 border-[#E1DDD5] border-t-[#FF9D00] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center bg-[#FCFAF2] text-[#1E1C1A] space-y-6">
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

  // Tính toán tổng tiền sau khi áp dụng mã giảm giá và Miễn phí vận chuyển
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shipping = 0; // Miễn phí vận chuyển toàn quốc tại Việt Nam
  const tax = 0;
  const total = subtotal - discountAmount + shipping + tax;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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

    // SỬA LỖI BIÊN DỊCH: Ép kiểu as any cho đối tượng order để tự do định nghĩa trường customerPhone và addresses.phone
    const order: any = {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. GỬI ĐĂNG KÝ BẢN TIN NẾU KHÁCH CHECK "GỬI TIN NỨC"
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

          // SỬA LỖI BIÊN DỊCH: Ép kiểu đối tượng cập nhật thành any để vượt qua ràng buộc Partial của updateProfile
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

  return (
    <div className="min-h-screen bg-white text-[#1E1C1A] antialiased selection:bg-[#EAE5D9]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* ============================================================================
           CỘT TRÁI (60% CHIỀU RỘNG): PHÂN KHU ĐIỀN THÔNG TIN KHÁCH HÀNG & FORM
           ============================================================================ */}
        <div className="lg:col-span-7 px-4 py-12 sm:px-12 lg:pl-24 lg:pr-16 space-y-8 bg-white border-r border-[#E1DDD5]">
          {/* Header Brand */}
          <div className="flex justify-between items-center pb-4 border-b border-[#E1DDD5]/60">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-black hover:text-[#FF9D00] transition-colors leading-none uppercase"
            >
              {siteConfig.name}
            </Link>
            <ShoppingBag className="h-5 w-5 text-[#786F66]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. KHU VỰC LIÊN HỆ */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="font-serif text-lg font-bold text-black">
                  Liên hệ
                </h3>

                {!isAuthenticated && (
                  <Link
                    href="/auth/login"
                    className="text-xs text-[#FF9D00] hover:underline font-mono uppercase"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
              <div className="space-y-3">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00] focus:ring-1 focus:ring-[#FF9D00] placeholder:text-neutral-400 bg-white"
                />

                <label className="flex items-center gap-2.5 text-xs text-[#5c544d] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="rounded border-[#CFCABF] text-[#FF9D00] focus:ring-[#FF9D00] h-4 w-4 cursor-pointer"
                  />
                  <span>Gửi cho tôi tin tức và ưu đãi qua email</span>
                </label>
              </div>
            </div>

            {/* 2. KHU VỰC GIAO HÀNG */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-black">
                Giao hàng
              </h3>

              <div className="space-y-3">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase">
                    Quốc gia/Vùng
                  </span>
                  <div className="h-11 rounded-lg border border-[#CFCABF] bg-neutral-50 px-4 text-xs font-semibold flex items-center justify-between text-black">
                    <span>Việt Nam</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    placeholder="Tên (không bắt buộc)"
                    value={form.firstName}
                    onChange={handleChange}
                    className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00]"
                  />
                  <Input
                    name="lastName"
                    placeholder="Họ"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00]"
                  />
                </div>

                <Input
                  name="line1"
                  placeholder="Địa chỉ"
                  value={form.line1}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00]"
                />

                <Input
                  name="line2"
                  placeholder="Căn hộ, phòng, v.v. (không bắt buộc)"
                  value={form.line2}
                  onChange={handleChange}
                  className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00]"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="city"
                    placeholder="Thành phố"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00]"
                  />
                  <Input
                    name="postalCode"
                    placeholder="Mã bưu chính (không bắt buộc)"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00]"
                  />
                </div>

                <Input
                  name="phone"
                  type="tel"
                  placeholder="Điện thoại"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg border border-[#CFCABF] px-4 text-sm text-black focus:border-[#FF9D00]"
                />

                <label className="flex items-center gap-2.5 text-xs text-[#5c544d] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="rounded border-[#CFCABF] text-[#FF9D00] focus:ring-[#FF9D00] h-4 w-4 cursor-pointer"
                  />
                  <span>
                    Lưu lại thông tin này cho lần sau{" "}
                    {isAuthenticated && "(Đồng bộ vào tài khoản của bạn)"}
                  </span>
                </label>
              </div>
            </div>

            {/* 3. PHƯƠNG THỨC VẬN CHUYỂN */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-black">
                Phương thức vận chuyển
              </h3>
              <div className="border border-[#CFCABF] rounded-xl p-4 bg-[#FCFAF2]/30 flex flex-col gap-1 text-sm text-left">
                <div className="flex items-center justify-between font-sans">
                  <span className="font-semibold text-black">
                    Standard Shipping
                  </span>
                  <span className="font-bold text-[#3ECF8E] uppercase tracking-wider font-mono">
                    MIỄN PHÍ
                  </span>
                </div>
                <p className="text-[11px] text-[#786F66] font-sans leading-normal mt-0.5">
                  ✓ Miễn phí vận chuyển toàn quốc cho mọi đơn hàng chế tác tại
                  Việt Nam.
                </p>
              </div>
            </div>

            {/* 4. THANH TOÁN (COD TIÊU CHUẨN) */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-black">
                  Thanh toán
                </h3>
                <p className="text-[11px] text-[#786F66] font-sans leading-none">
                  Toàn bộ các giao dịch được bảo mật và mã hóa.
                </p>
              </div>

              <div className="border border-[#CFCABF] rounded-xl overflow-hidden bg-white">
                <div className="p-4 bg-[#FAF5F2]/60 border-b border-[#E1DDD5] flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-black">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </div>
                <div className="p-4 bg-[#FCFAF2]/30 text-xs leading-relaxed text-[#5c544d] font-sans italic border-t border-[#E1DDD5]/40 text-left">
                  &quot;Hệ thống áp dụng phương thức Thanh toán khi nhận hàng
                  (COD) và Miễn phí vận chuyển hoàn toàn trên phạm vi toàn quốc
                  (Việt Nam). Bạn chỉ cần kiểm tra chất lượng sản phẩm mộc/DIY
                  khi nhận được từ shipper và thanh toán đúng số tiền hàng mộc
                  mạc nguyên bản.&quot;
                </div>
              </div>
            </div>

            {/* LỆNH THANH TOÁN NGAY DẸT TRÒN LỚN */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                {loading ? "Đang xử lý đơn hàng..." : "Thanh toán ngay"}
              </Button>
            </div>
          </form>
        </div>

        {/* ============================================================================
           CỘT PHẢI (40% CHIỀU RỘNG): TÓM TẮT ĐƠN HÀNG NỀN NGÀ CÁT #FAF5F2 CHUẨN HÃNG
           ============================================================================ */}
        <div className="lg:col-span-5 px-4 py-12 sm:px-12 lg:pl-16 lg:pr-24 bg-[#FAF5F2] flex flex-col justify-start space-y-8">
          {/* Danh sách sản phẩm kèm Thumbnail có huy hiệu Số lượng */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#EAE5D9]">
            {items.map((item) => {
              const imgUrl = item.image?.url || PLACEHOLDER_IMAGE;
              const imgAlt = item.image?.alt || item.name;

              return (
                <div
                  key={item.variantId}
                  className="flex items-center gap-4 py-1"
                >
                  {/* Thumbnail kèm huy hiệu đen tròn */}
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-[#DCD6CC] bg-white shadow-xs">
                    <Image
                      src={imgUrl}
                      alt={imgAlt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-[#1E1C1A] text-white text-[10px] font-mono font-bold flex items-center justify-center rounded-full border border-[#DCD6CC] shadow-md">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Tên & Phân loại rõ ràng */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs sm:text-sm font-serif font-bold text-black truncate">
                      {item.name}
                    </p>
                    {item.variantName &&
                      item.variantName !== "Default Variant" && (
                        <p className="text-[10px] text-[#786F66] font-sans font-medium mt-0.5 truncate">
                          {item.variantName}
                        </p>
                      )}
                  </div>

                  {/* Giá dòng tiền */}
                  <span className="shrink-0 text-xs sm:text-sm font-mono font-bold text-black">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              );
            })}
          </div>

          <Separator className="bg-[#E1DDD5]" />

          {/* Ô Nhập Mã giảm giá lồng nút Áp dụng dẹt kết nối trực tiếp đến Supabase Coupons */}
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

          {/* Bảng kê tổng các chi phí sau chiết khấu */}
          <div className="space-y-3.5 text-xs font-sans text-left">
            <div className="flex justify-between text-[#5c544d]">
              <span>Tổng phụ</span>
              <span className="font-mono font-bold text-black">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Mục chiết khấu giảm giá nếu áp dụng thành công */}
            {discountPercent > 0 && (
              <div className="flex justify-between text-[#E26E67] font-medium">
                <span>
                  Giảm giá (${appliedCoupon} - ${discountPercent}%)
                </span>
                <span className="font-mono font-bold">
                  -{formatPrice(discountAmount)}
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
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
