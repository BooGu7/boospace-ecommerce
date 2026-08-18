"use client";

import {
  Banknote,
  ChevronDown,
  HelpCircle,
  Loader2,
  MapPin,
  Package,
  Phone,
  QrCode,
  ShieldCheck,
  Truck,
  User,
  Video,
} from "lucide-react";
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
  district?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  formattedAddress?: string;
}

interface GHNProvince {
  ProvinceID: number;
  ProvinceName: string;
}

interface GHNDistrict {
  DistrictID: number;
  DistrictName: string;
}

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

// HÀM KIỂM TRA TP. HỒ CHÍ MINH CHUẨN XÁC 100% (THEO ID HOẶC TÊN)
function checkIsHCMC(provinceId: number, cityName: string): boolean {
  if (provinceId === 202) return true; // Mã ID chính thức của TP.HCM trên GHN
  const clean = (cityName || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return (
    clean.includes("ho chi minh") ||
    clean.includes("hcm") ||
    clean.includes("sai gon")
  );
}

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

  // Danh sách Tỉnh / Huyện GHN
  const [provinces, setProvinces] = useState<GHNProvince[]>([]);
  const [districts, setDistricts] = useState<GHNDistrict[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(202); // 202 = TP.HCM
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(1446); // 1446 = Bình Thạnh
  const [selectedWardCode, _setSelectedWardCode] = useState<string>("20601");

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    line1: "",
    district: "Quận Bình Thạnh",
    city: "Hồ Chí Minh",
    notes: "",
  });

  // State Cước vận chuyển GHN
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShip, setIsCalculatingShip] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const [addons, setAddons] = useState<AddonProduct[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. NẠP DANH SÁCH 63 TỈNH THÀNH GHN
  useEffect(() => {
    if (!mounted) return;
    async function loadProvinces() {
      try {
        const res = await fetch("/api/shipping/locations");
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProvinces(data.data);
          const hcm = data.data.find(
            (p: GHNProvince) =>
              p.ProvinceID === 202 || p.ProvinceName.includes("Hồ Chí Minh"),
          );
          if (hcm) {
            setSelectedProvinceId(hcm.ProvinceID);
            setForm((prev) => ({ ...prev, city: hcm.ProvinceName }));
          }
        }
      } catch (err) {
        console.error("Lỗi nạp tỉnh thành GHN:", err);
      }
    }
    loadProvinces();
  }, [mounted]);

  // 2. NẠP DANH SÁCH QUẬN / HUYỆN KHI ĐỔI TỈNH
  useEffect(() => {
    if (!selectedProvinceId) return;

    async function loadDistricts() {
      try {
        const res = await fetch(
          `/api/shipping/locations?provinceId=${selectedProvinceId}`,
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDistricts(data.data);
          const firstDist = data.data[0];
          setSelectedDistrictId(firstDist.DistrictID);
          setForm((prev) => ({ ...prev, district: firstDist.DistrictName }));
        }
      } catch (err) {
        console.error("Lỗi nạp quận huyện GHN:", err);
      }
    }
    loadDistricts();
  }, [selectedProvinceId]);

  // 3. TÍNH TOÁN CƯỚC VẬN CHUYỂN CHUẨN XÁC: MIỄN PHÍ HCM VÀ ĐƠN >= 500K, CÒN LẠI LẤY CƯỚC GHN
  useEffect(() => {
    if (!mounted || items.length === 0) return;

    const subtotalCents = getSubtotal();
    const subtotalVND =
      (subtotalCents - Math.round(subtotalCents * (discountPercent / 100))) /
      100;
    const isHCM = checkIsHCMC(selectedProvinceId, form.city);

    // [QUY TẮC 1 & 2]: Miễn phí nếu ở TP.HCM HOẶC đơn hàng >= 500.000 ₫
    if (isHCM || subtotalVND >= (siteConfig.freeShippingThreshold || 500000)) {
      setShippingFee(0);
      setIsCalculatingShip(false);
      return;
    }

    // [QUY TẮC 3]: Ngoại tỉnh < 500k -> Gọi API GHN tính cước thật
    async function fetchGHNShippingFee() {
      setIsCalculatingShip(true);
      try {
        const res = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: form.city,
            provinceId: selectedProvinceId,
            districtId: selectedDistrictId,
            wardCode: selectedWardCode,
            subtotal: subtotalVND,
            weightGrams: items.reduce(
              (sum, item) => sum + item.quantity * 250,
              100,
            ),
          }),
        });
        const data = await res.json();
        if (data.success && typeof data.fee === "number") {
          setShippingFee(data.fee);
        } else {
          setShippingFee(34000);
        }
      } catch {
        setShippingFee(34000);
      } finally {
        setIsCalculatingShip(false);
      }
    }

    const timer = setTimeout(fetchGHNShippingFee, 150);
    return () => clearTimeout(timer);
  }, [
    mounted,
    selectedProvinceId,
    form.city,
    selectedDistrictId,
    selectedWardCode,
    items,
    discountPercent,
    getSubtotal,
  ]);

  // Nạp thông tin tài khoản nếu đã đăng nhập
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
        district: defaultAddr?.district || "Quận Bình Thạnh",
        city: defaultAddr?.city || "Hồ Chí Minh",
        notes: "",
      });
    }
  }, [mounted, isAuthenticated, user]);

  // Nạp sản phẩm mua kèm
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
        <Loader2 className="size-6 text-[#FF9D00] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <Package className="size-16 text-[#786F66] mx-auto stroke-[1.25]" />
          <h1 className="font-serif text-3xl font-bold text-black">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-xs font-sans text-[#786F66]">
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán nhé ✨
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const provId = Number(e.target.value);
    setSelectedProvinceId(provId);
    const matched = provinces.find((p) => p.ProvinceID === provId);
    if (matched) {
      setForm((prev) => ({ ...prev, city: matched.ProvinceName }));
    }
  }

  function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const distId = Number(e.target.value);
    setSelectedDistrictId(distId);
    const matched = districts.find((d) => d.DistrictID === distId);
    if (matched) {
      setForm((prev) => ({ ...prev, district: matched.DistrictName }));
    }
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
    const formattedAddressStr = `${form.line1}, ${form.district}, ${form.city}, Việt Nam`;

    const fullAddressObj: UserAddress = {
      id: `addr-${Date.now()}`,
      firstName: form.firstName || "",
      lastName: form.lastName,
      line1: form.line1,
      district: form.district,
      city: form.city,
      state: "Việt Nam",
      postalCode: "700000",
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
        console.warn("Lỗi lưu địa chỉ tài khoản:", err);
      }
    }

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
      toast.error(errorMsg);
      setLoading(false);
    }
  }

  const checkoutProductIds = new Set(items.map((i) => i.productId));
  const filteredAddons = addons.filter((a) => !checkoutProductIds.has(a.id));

  return (
    <div className="bg-[#FCFAF2] min-h-screen w-full relative selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50 text-[#1E1C1A]">
        {/* TIÊU ĐỀ TRANG: FONT SERIF CAO CẤP */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black border-b border-[#E1DDD5] pb-6 text-left">
          Thanh toán đơn hàng
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          <div className="space-y-8 lg:col-span-7">
            {/* THÔNG TIN LIÊN HỆ */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
                <CardTitle className="font-serif text-lg font-bold text-black flex items-center gap-2">
                  <User className="size-4.5 text-[#FF9D00]" /> Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
                    >
                      Địa chỉ Email nhận thông báo *
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
                      Số điện thoại nhận hàng *
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

            {/* ĐỊA CHỈ GIAO HÀNG (DROPDOWN 63 TỈNH & QUẬN HUYỆN) */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
                <CardTitle className="font-serif text-lg font-bold text-black flex items-center gap-2">
                  <MapPin className="size-4.5 text-[#3ECF8E]" /> Địa chỉ giao
                  nhận
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block"
                    >
                      Họ của bạn *
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
                      Tên của bạn *
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
                    Địa chỉ chi tiết (Số nhà, tên đường...) *
                  </Label>
                  <Input
                    id="line1"
                    name="line1"
                    placeholder="Ví dụ: 19/16 Lam Sơn, Phường Đức Nhuận..."
                    value={form.line1}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                  />
                </div>

                {/* 2 DROPDOWN LIÊN KẾT: TỈNH / THÀNH PHỐ & QUẬN / HUYỆN */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block">
                      Tỉnh / Thành phố *
                    </Label>
                    <div className="relative">
                      <select
                        name="city"
                        value={selectedProvinceId}
                        onChange={handleProvinceChange}
                        className="w-full h-10 appearance-none rounded-xl border border-[#CFCABF] bg-white px-3.5 pr-8 text-xs font-sans font-bold text-black outline-none focus:border-[#FF9D00] cursor-pointer"
                      >
                        {provinces.length > 0 ? (
                          provinces.map((p) => (
                            <option key={p.ProvinceID} value={p.ProvinceID}>
                              {p.ProvinceName}
                            </option>
                          ))
                        ) : (
                          <option value={202}>Hồ Chí Minh</option>
                        )}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block">
                      Quận / Huyện *
                    </Label>
                    <div className="relative">
                      <select
                        name="district"
                        value={selectedDistrictId}
                        onChange={handleDistrictChange}
                        className="w-full h-10 appearance-none rounded-xl border border-[#CFCABF] bg-white px-3.5 pr-8 text-xs font-sans font-bold text-black outline-none focus:border-[#FF9D00] cursor-pointer"
                      >
                        {districts.length > 0 ? (
                          districts.map((d) => (
                            <option key={d.DistrictID} value={d.DistrictID}>
                              {d.DistrictName}
                            </option>
                          ))
                        ) : (
                          <option value={1446}>Quận Bình Thạnh</option>
                        )}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* THÔNG BÁO CƯỚC VẬN CHUYỂN TIÊU CHUẨN */}
                <div className="p-3.5 rounded-2xl bg-[#FCFAF2] border border-[#E1DDD5] flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-[#786F66]" />
                    <span className="text-[#5c544d]">
                      Hình thức: <strong>Giao hàng tiêu chuẩn</strong>
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm">
                    {isCalculatingShip ? (
                      <Loader2 className="size-3.5 animate-spin text-[#FF9D00]" />
                    ) : shippingFee === 0 ? (
                      <span className="text-[#3ECF8E]">MIỄN PHÍ</span>
                    ) : (
                      formatVND(shippingFee)
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* GHI CHÚ ĐƠN HÀNG */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
              <CardHeader className="p-0 pb-3 border-b border-[#E1DDD5]/40 mb-3">
                <CardTitle className="font-serif text-base font-bold text-black">
                  Ghi chú đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Ví dụ: Đóng gói cẩn thận giúp mình làm quà tặng, giao giờ hành chính..."
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium p-3 outline-none resize-none"
                />
              </CardContent>
            </Card>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-xs text-left">
              <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-4">
                <CardTitle className="font-serif text-lg font-bold text-black">
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* VIETQR */}
                  <div
                    onClick={() => setPaymentMethod("vietqr")}
                    className={`border-2 rounded-2xl p-4 flex flex-col justify-between min-h-[130px] relative cursor-pointer transition-all ${
                      paymentMethod === "vietqr"
                        ? "border-[#FF9D00] bg-[#FCFAF2]/50 ring-1 ring-[#FF9D00]"
                        : "border-[#E1DDD5] bg-white hover:border-[#CFCABF]"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-mono font-bold text-[#FF9D00] flex items-center gap-1.5">
                        <QrCode className="size-4 text-[#FF9D00]" /> 01 / VIETQR
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
                        Chuyển khoản VietQR tự động
                      </h4>
                      <p className="text-[10px] font-sans text-[#786F66] leading-relaxed">
                        Quét mã QR qua App Ngân hàng, đối soát tự động trong 5
                        giây.
                      </p>
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`border-2 rounded-2xl p-4 flex flex-col justify-between min-h-[130px] relative cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#FF9D00] bg-[#FCFAF2]/50 ring-1 ring-[#FF9D00]"
                        : "border-[#E1DDD5] bg-white hover:border-[#CFCABF]"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-mono font-bold text-[#786F66] flex items-center gap-1.5">
                        <Banknote className="size-4 text-emerald-600" /> 02 /
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
                </div>

                <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5 font-sans">
                  <Video className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Lưu ý đồng kiểm:</strong> Quý khách vui lòng quay
                    video mở hộp khi nhận hàng để được hỗ trợ bảo hành đổi trả
                    miễn phí trong 30 ngày.
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
                {loading
                  ? "Đang ghi nhận..."
                  : `Thanh toán ${formatVND(total / 100)}`}
              </Button>
            </div>
          </div>

          {/* CỘT PHẢI - TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:col-span-5">
            <Card className="sticky top-24 rounded-3xl border border-[#DCD6CC] bg-[#FAF5F2]/90 p-6 shadow-md space-y-6">
              <CardHeader className="p-0 pb-3 border-b border-[#E1DDD5]/60">
                <CardTitle className="font-serif text-lg font-bold text-black text-left flex items-center justify-between">
                  <span>Tóm tắt đơn hàng</span>
                  <span className="text-xs font-mono font-normal text-[#786F66]">
                    ({items.reduce((a, b) => a + b.quantity, 0)} món)
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                {/* DANH SÁCH MÓN HÀNG */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#EAE5D9]">
                  {items.map((item) => {
                    const imgUrl = item.image?.url || PLACEHOLDER_IMAGE;
                    return (
                      <div
                        key={item.variantId}
                        className="flex items-start gap-3.5 pb-3.5 border-b border-[#E1DDD5]/60 last:border-0 last:pb-0"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20">
                          <Image
                            src={imgUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                          <span className="absolute -top-0.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black text-[9px] font-mono font-bold text-white shadow-md">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 text-left space-y-0.5">
                          <p className="text-xs sm:text-sm font-serif font-bold text-black leading-snug truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-mono text-[#786F66]">
                            Đơn giá:{" "}
                            <strong className="text-black">
                              {formatVND(item.price / 100)}
                            </strong>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-mono font-bold text-black">
                            {formatVND(item.lineTotal / 100)}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveItem(item.variantId, item.name)
                            }
                            className="text-[10px] font-mono font-bold text-[#786F66] hover:text-red-500 transition-colors uppercase block mt-1 cursor-pointer"
                          >
                            Gỡ bỏ
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-[#E1DDD5]" />

                {/* MÃ GIẢM GIÁ */}
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
                    className="rounded-lg bg-[#EAE5D9]/40 border border-[#CFCABF] text-black font-mono uppercase text-[10px] font-bold tracking-wider px-5 py-3 cursor-pointer hover:bg-white disabled:opacity-50 transition-colors flex items-center justify-center min-w-[80px]"
                  >
                    {applying ? (
                      <Loader2 className="size-3 animate-spin text-black" />
                    ) : (
                      "Áp dụng"
                    )}
                  </button>
                </div>

                <Separator className="bg-[#E1DDD5]" />

                {/* UPSELL MUA KÈM */}
                {filteredAddons.length > 0 && (
                  <div className="bg-white border border-[#E1DDD5] rounded-3xl p-5 space-y-4 shadow-sm text-left">
                    <div className="space-y-0.5 border-b border-[#E1DDD5]/40 pb-2">
                      <h4 className="font-serif text-sm font-bold text-black">
                        Hoàn thiện không gian mộc mạc
                      </h4>
                      <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                        SẢN PHẨM GỢI Ý CHO GÓC LÀM VIỆC
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

                {/* HẠCH TOÁN CHI PHÍ (MIỄN PHÍ HCM VÀ ĐƠN >= 500K) */}
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
                        Giảm giá ({appliedCoupon} - {discountPercent}%):
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
                      {isCalculatingShip ? (
                        <Loader2 className="size-3 animate-spin text-[#FF9D00] inline" />
                      ) : shippingFee === 0 ? (
                        <span className="text-[#3ECF8E]">
                          MIỄN PHÍ VẬN CHUYỂN
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
                    <span className="font-mono text-lg text-[#FF9D00] font-black">
                      {formatVND(total / 100)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 hidden lg:block">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors shadow-sm"
                  >
                    {loading
                      ? "Đang ghi nhận..."
                      : `Xác nhận thanh toán (${formatVND(total / 100)})`}
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
