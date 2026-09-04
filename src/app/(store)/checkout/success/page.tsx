"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { VietQRPayment } from "@/components/checkout/vietqr-payment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessFallback() {
  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9D00] mx-auto" />
        <p className="text-xs font-mono text-[#786F66] uppercase tracking-widest">
          Đang nạp dữ liệu biên nhận...
        </p>
      </div>
    </div>
  );
}

interface OrderRecord {
  id: string;
  code?: string;
  payment_method?: string;
  paymentMethod?: string;
  payment_status?: string;
  paymentStatus?: string;
  order_status?: string;
  notes?: string;
  created_at?: string;
  total?: number;
  subtotal?: number;
  shipping?: number;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  shipping_address?: {
    formattedAddress?: string;
    line1?: string;
    district?: string;
    city?: string;
    payos_qr_code?: string;
    payos_checkout_url?: string;
    items_detail?: {
      name: string;
      quantity: number;
      price: number;
      variantName?: string;
    }[];
  };
  order_items?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    variant_name?: string;
  }[];
}

interface PayosData {
  qrCode?: string;
  checkoutUrl?: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("code");

  const [orderDetails, setOrderDetails] = useState<OrderRecord | null>(null);
  const [payosData, setPayosData] = useState<PayosData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    async function fetchOrder() {
      try {
        const res = await fetch(
          `/api/orders?order_id=${encodeURIComponent(orderId || "")}`,
          { cache: "no-store" },
        );
        const resData = await res.json();

        if (res.ok && resData.success && resData.order) {
          setOrderDetails(resData.order);
          if (resData.payos) {
            setPayosData(resData.payos);
          }
        }
      } catch (err) {
        console.error("Lỗi nạp đơn hàng thành công:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) return <CheckoutSuccessFallback />;

  const rawPM = String(
    orderDetails?.payment_method || orderDetails?.paymentMethod || "",
  ).toLowerCase();
  const isVietQR = rawPM.includes("vietqr");
  const isPaid =
    String(
      orderDetails?.payment_status || orderDetails?.paymentStatus || "",
    ).toLowerCase() === "paid";

  const cleanCustomerNotes = String(orderDetails?.notes || "")
    .replace(/PayOS_Code:\s*\d+\s*\|\s*/gi, "")
    .trim();

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center space-y-8 animate-in fade-in duration-300">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle2 className="h-20 w-20 text-[#3ECF8E] stroke-[1.25]" />
          </motion.div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
              Order Confirmed
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black leading-none">
              Cảm ơn bạn đã đặt hàng ✨
            </h1>
            <p className="text-sm text-[#786F66] leading-relaxed max-w-md mx-auto">
              Đơn hàng của bạn đã được ghi nhận thành công trên hệ thống. Đội
              ngũ Boo Space sẽ sớm chuẩn bị chế tác và giao tới bạn.
            </p>
          </div>

          {/* COMPONENT VIETQR PAYOS: HIỂN THỊ MÃ QR PAYOS CHÍNH THỨC */}
          {orderDetails && isVietQR && !isPaid && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full"
            >
              <VietQRPayment
                orderId={orderDetails.code || orderDetails.id}
                amount={Number(orderDetails.total ?? 0)}
                payosQrCode={
                  payosData?.qrCode ||
                  orderDetails.shipping_address?.payos_qr_code
                }
                payosCheckoutUrl={
                  payosData?.checkoutUrl ||
                  orderDetails.shipping_address?.payos_checkout_url
                }
                onSuccess={() => {
                  setOrderDetails((prev) =>
                    prev ? { ...prev, payment_status: "Paid" } : null,
                  );
                }}
              />
            </motion.div>
          )}

          {/* CHI TIẾT ĐƠN HÀNG */}
          {orderDetails && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                delay: 0.1,
              }}
              className="w-full text-left"
            >
              <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-8 shadow-xs space-y-6">
                <div className="space-y-3 pb-4 border-b border-[#E1DDD5]/60 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#786F66] font-mono uppercase tracking-wider">
                      Mã số đơn hàng
                    </span>
                    <span className="font-mono font-bold text-black">
                      #{orderDetails.code || orderDetails.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786F66] font-mono uppercase tracking-wider">
                      Phương thức thanh toán
                    </span>
                    <span className="font-bold text-black">
                      {isVietQR
                        ? "Chuyển khoản VietQR"
                        : "Thanh toán khi nhận hàng (COD)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786F66] font-mono uppercase tracking-wider">
                      Trạng thái thanh toán
                    </span>
                    <span
                      className={`font-mono font-bold px-2.5 py-0.5 rounded-md ${
                        String(orderDetails.payment_status).toLowerCase() ===
                        "paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {String(orderDetails.payment_status).toLowerCase() ===
                      "paid"
                        ? "✓ ĐÃ THANH TOÁN"
                        : "CHỜ CHUYỂN KHOẢN"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786F66] font-mono uppercase tracking-wider">
                      Thời gian khởi tạo
                    </span>
                    <span className="font-mono font-medium text-black">
                      {orderDetails.created_at
                        ? new Date(orderDetails.created_at).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "Vừa xong"}
                    </span>
                  </div>
                </div>

                <div className="border border-[#E1DDD5] rounded-2xl p-5 bg-[#FCFAF2]/60 space-y-3 text-xs font-sans">
                  <h3 className="font-serif text-sm font-bold text-black border-b border-[#E1DDD5]/80 pb-2">
                    Thông tin nhận hàng
                  </h3>

                  <div className="flex items-center gap-2.5 text-black">
                    <User className="size-4 text-[#786F66] shrink-0" />
                    <span>
                      <strong>Người nhận:</strong>{" "}
                      {orderDetails.customer_name || "Khách hàng"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[#1E1C1A]">
                    <Phone className="size-4 text-[#786F66] shrink-0" />
                    <span>
                      <strong>Số điện thoại:</strong>{" "}
                      {orderDetails.customer_phone || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-[#1E1C1A]">
                    <MapPin className="size-4 text-[#786F66] shrink-0 mt-0.5" />
                    <span>
                      <strong>Địa chỉ giao hàng:</strong>{" "}
                      {orderDetails.customer_address || "N/A"}
                    </span>
                  </div>

                  {cleanCustomerNotes && (
                    <div className="flex items-start gap-2.5 text-[#1E1C1A] pt-1 border-t border-[#E1DDD5]/60">
                      <FileText className="size-4 text-[#786F66] shrink-0 mt-0.5" />
                      <span>
                        <strong>Ghi chú đơn hàng:</strong> {cleanCustomerNotes}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="bg-[#E1DDD5]/80" />

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#786F66]">Tạm tính phụ</span>
                    <span className="font-mono font-medium text-black">
                      {formatVND(Number(orderDetails.subtotal ?? 0))}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#786F66]">Chi phí vận chuyển</span>
                    <span className="font-mono font-semibold text-black">
                      {Number(orderDetails.shipping ?? 0) === 0
                        ? "Miễn phí vận chuyển"
                        : formatVND(Number(orderDetails.shipping))}
                    </span>
                  </div>

                  <Separator className="bg-[#E1DDD5]/40 my-2" />

                  <div className="flex justify-between text-sm font-serif font-bold text-black pt-1">
                    <span>Tổng cộng hóa đơn</span>
                    <span className="font-mono text-base text-[#FF9D00]">
                      {formatVND(Number(orderDetails.total ?? 0))}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4 relative z-10">
            <Button
              asChild
              size="lg"
              className="bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs font-bold tracking-wider py-4 px-6 rounded-xl cursor-pointer"
            >
              <Link href="/account/orders">
                <Package className="mr-2 h-4 w-4" /> Xem đơn hàng của tôi
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              size="lg"
              className="rounded-xl border-[#E1DDD5] bg-white hover:bg-[#EAE5D9]/30 text-black font-mono uppercase text-xs font-bold tracking-wider py-4 px-6 cursor-pointer"
            >
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" /> Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
