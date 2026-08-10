"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, CalendarDays, Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";

interface OrderItem {
  id: string;
  name: string;
  variantName?: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status: any;
  paymentStatus: string;
  items: OrderItem[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 130, damping: 20 },
  },
  hover: {
    y: -4,
    borderColor: "#1E1C1A",
    boxShadow: "0 15px 30px -10px rgba(28, 28, 28, 0.06)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const formatVNDDirect = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatVNDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function OrdersPage() {
  const { user, isReady } = useAuthGuard();
  const [ordersList, setOrdersList] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !user?.email) {
      setLoading(false);
      return;
    }

    const userEmail = user.email.trim().toLowerCase();

    async function fetchDetailedOrders() {
      try {
        // Tìm đơn hàng theo cả Email HOẶC Customer ID
        let query = supabase.from("orders").select(
          `
            id,
            code,
            created_at,
            total,
            order_status,
            payment_status,
            order_items (
              id,
              product_name,
              variant_name,
              quantity,
              unit_price,
              total_price
            )
          `,
        );

        if (user?.id) {
          query = query.or(`customer_email.ilike.${userEmail},customer_id.eq.${user.id}`);
        } else {
          query = query.ilike("customer_email", userEmail);
        }

        const { data, error } = await query.order("created_at", {
          ascending: false,
        });

        if (error) {
          console.error("[SUPABASE_FETCH_ORDERS_ERROR]", error);
        } else if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: OrderDetail[] = data.map((o: any) => ({
            id: o.id,
            orderNumber: o.code || o.id,
            createdAt: o.created_at,
            total: Number(o.total ?? 0),
            status: o.order_status || "pending",
            paymentStatus: o.payment_status || "Pending",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: (o.order_items || []).map((oi: any, idx: number) => ({
              id: oi.id || `${o.id}-item-${idx}`,
              name: oi.product_name || "Sản phẩm chế tác 3D",
              variantName: oi.variant_name || "Mặc định",
              quantity: Number(oi.quantity ?? 1),
              price: Number(oi.unit_price ?? 0),
              imageUrl: PLACEHOLDER_IMAGE,
            })),
          }));
          setOrdersList(mapped);
        }
      } catch (err) {
        console.error("Lỗi đồng bộ hóa hóa đơn:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetailedOrders();
  }, [isReady, user]);

  if (!isReady) return null;

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        <div className="border-b border-[#E1DDD5] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              ORDERS HISTORY
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Đơn hàng của tôi
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Lịch sử các hóa đơn giao dịch của tài khoản
            </p>
          </div>

          <Link
            href="/account"
            className="text-xs font-mono text-[#786F66] hover:text-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            Quay lại bảng điều khiển <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF9D00]" />
          </div>
        ) : ordersList.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Chưa có đơn hàng nào"
            description="Khi bạn thực hiện đặt hàng, hóa đơn giao dịch sẽ xuất hiện tại đây."
            actionLabel="Bắt đầu mua sắm"
            actionHref="/shop"
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 max-w-4xl mx-auto text-left"
          >
            {ordersList.map((order) => (
              <motion.div key={order.id} variants={cardVariants} whileHover="hover" className="block">
                <Card className="rounded-[32px] border border-[#DCD6CC] bg-white shadow-xs p-6 space-y-5 transition-all">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold text-black uppercase tracking-wider">
                        Mã đơn: #{order.orderNumber}
                      </p>
                      <p className="text-xs text-[#786F66] mt-1 flex items-center gap-1.5 font-mono">
                        <CalendarDays className="size-3.5" />
                        {formatVNDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <OrderStatusBadge status={order.status as any} />
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {order.paymentStatus === "Paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                      </span>
                      <span className="text-sm sm:text-base font-mono font-bold text-[#FF9D00]">
                        {formatVNDDirect(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3.5">
                    {order.items.map((item) => {
                      const itemPrice = item.price ?? 0;
                      const imgUrl = item.imageUrl || PLACEHOLDER_IMAGE;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 text-xs font-sans font-medium animate-in fade-in duration-200"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-sm">
                            <Image src={imgUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                          </div>

                          <div className="flex-1 min-w-0 pr-4 text-left">
                            <span className="text-black font-serif font-bold text-sm block leading-tight truncate">
                              {item.name}
                            </span>
                            {item.variantName &&
                              item.variantName !== "Default Variant" &&
                              item.variantName !== "Mặc định" && (
                                <span className="text-[9px] font-mono text-[#786F66] bg-[#EAE5D9]/40 border border-[#DCD6CC] px-2 py-0.5 rounded-md mt-1 inline-block font-semibold uppercase tracking-wider">
                                  {item.variantName}
                                </span>
                              )}
                          </div>

                          <div className="font-mono text-right shrink-0">
                            <span className="text-slate-500 mr-1.5">({formatVNDDirect(itemPrice)})</span>
                            <span className="text-black font-bold">× {item.quantity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
