"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, Package, ShoppingBag } from "lucide-react";
import { useOrdersStore } from "@/store/orders";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Định dạng tiền tệ Việt Nam (VND) trực tiếp để tránh lỗi chênh lệch chia 100 của formatPrice
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

// Màn hình chờ tải ngà cát mộc mạc đồng bộ hệ thống
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

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const getOrderById = useOrdersStore((s) => s.getOrderById);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <CheckoutSuccessFallback />;
  }

  const order = orderId ? getOrderById(orderId) : undefined;

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center space-y-8 animate-in fade-in duration-300">
          {/* Vòng tròn chúc mừng nở Spring */}
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
              ngũ của Boo Space sẽ sớm liên hệ qua Email / Điện thoại để xác
              nhận và chuẩn bị chế tác giao hàng đến bạn.
            </p>
          </div>

          {/* KHUNG BIÊN NHẬN THẺ GIẤY DẸT CAO CẤP */}
          {order && (
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
              <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-8 shadow-sm space-y-6">
                {/* Meta info */}
                <div className="space-y-3 pb-4 border-b border-[#E1DDD5]/60 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#786F66] font-mono uppercase tracking-wider">
                      Mã số đơn hàng
                    </span>
                    <span className="font-mono font-bold text-black">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786F66] font-mono uppercase tracking-wider">
                      Ngày khởi tạo
                    </span>
                    <span className="font-mono font-medium text-black">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-bold block">
                    Chi tiết sản phẩm
                  </span>

                  <div className="space-y-3.5">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start gap-4 text-xs font-sans"
                      >
                        <span className="text-[#5c544d] flex-1 font-serif font-bold">
                          {item.name}{" "}
                          <span className="font-mono font-normal text-[#786F66] ml-1.5">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="font-mono font-semibold text-black shrink-0">
                          {formatVND(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[#E1DDD5]/80" />

                {/* Totals Summary */}
                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#786F66]">Cộng phụ</span>
                    <span className="font-mono font-medium text-black">
                      {formatVND(order.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#786F66]">Chi phí vận chuyển</span>
                    <span className="font-mono font-semibold text-black">
                      {order.shipping === 0
                        ? "Miễn phí vận chuyển"
                        : formatVND(order.shipping)}
                    </span>
                  </div>

                  {order.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#786F66]">Thuế VAT</span>
                      <span className="font-mono font-medium text-[#786F66]">
                        {formatVND(order.tax)}
                      </span>
                    </div>
                  )}

                  <Separator className="bg-[#E1DDD5]/40 my-2" />

                  <div className="flex justify-between text-sm font-serif font-bold text-black pt-1">
                    <span>Tổng cộng hóa đơn</span>
                    <span className="font-mono text-base text-[#FF9D00]">
                      {formatVND(order.total)}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Nút thao tác dẹt ngang */}
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
