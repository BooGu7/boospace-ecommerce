"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Package, CalendarDays, Loader2, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: any;
  items: OrderItem[];
}

// Cấu hình Hoạt ảnh Spring mượt mà dẹt ngang (Type-safe)
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

// Định dạng trực tiếp tiền tệ Việt Nam (VND) không nhân chia
const formatVNDDirect = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Định dạng ngày tháng thủ công chuẩn xác dạng DD/MM/YYYY cho Việt Nam
const formatVNDate = (dateStr: string) => {
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

  // KÉO DỮ LIỆU ĐƠN HÀNG THỜI GIAN THỰC TỪ SUPABASE
  useEffect(() => {
    // 1. Kiểm tra an toàn cho TypeScript, hẹp phạm vi biến (Narrowing)
    if (!isReady || !user?.email) {
      setLoading(false);
      return;
    }

    // 2. Gán hằng số cục bộ không đổi để pass kiểm tra TypeScript Closure
    const userEmail = user.email;

    async function fetchDetailedOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            code,
            created_at,
            total,
            order_status,
            order_items (
              quantity,
              unit_price,
              products (
                name,
                images
              )
            )
          `,
          )
          .eq("customer_email", userEmail)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const mapped: OrderDetail[] = data.map((o: any) => ({
            id: o.id,
            orderNumber: o.code,
            createdAt: o.created_at,
            total: Number(o.total ?? 0), // Lấy trực tiếp tiền tệ VND thực tế từ DB, không nhân 100
            status: o.order_status,
            items: (o.order_items || []).map((oi: any, idx: number) => ({
              id: `${o.id}-item-${idx}`,
              name: oi.products?.name || "Sản phẩm chế tác",
              quantity: oi.quantity,
              price: Number(oi.unit_price ?? 0), // Lấy trực tiếp đơn giá VND thực tế từ DB, không nhân 100
              imageUrl: oi.products?.images?.[0] || PLACEHOLDER_IMAGE,
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
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
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
          /* DANH SÁCH ĐƠN HÀNG HOẠT ẢNH STAGGERED FADE-UP */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 max-w-4xl mx-auto text-left"
          >
            {ordersList.map((order) => (
              <motion.div
                key={order.id}
                variants={cardVariants}
                whileHover="hover"
                className="block"
              >
                <Card className="rounded-[32px] border border-[#DCD6CC] bg-white shadow-xs p-6 space-y-5 transition-all">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold text-black uppercase tracking-wider">
                        Mã đơn: #{order.orderNumber}
                      </p>
                      <p className="text-xs text-[#786F66] mt-1 flex items-center gap-1.5 font-mono">
                        <CalendarDays className="size-3.5" />
                        {/* Cập nhật định dạng ngày Việt Nam chuẩn xác */}
                        {formatVNDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Badge trạng thái dẹt */}
                      <OrderStatusBadge status={order.status} />
                      <span className="text-sm sm:text-base font-mono font-bold text-[#FF9D00]">
                        {formatVNDDirect(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* BẢNG KÊ CHI TIẾT SẢN PHẨM CÓ ẢNH THUMBNAIL DẸT TIN XẢO */}
                  <div className="border-t border-slate-100 pt-4 space-y-3.5">
                    {order.items.map((item: any) => {
                      const itemPrice = item.price ?? 0;
                      const imgUrl = item.imageUrl || PLACEHOLDER_IMAGE;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 text-xs font-sans font-medium animate-in fade-in duration-200"
                        >
                          {/* Ảnh đại diện thu nhỏ sản phẩm đã mua */}
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E1DDD5] bg-[#EAE5D9]/20 shadow-sm">
                            <Image
                              src={imgUrl}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>

                          {/* Tên sản phẩm */}
                          <div className="flex-1 min-w-0 pr-4 text-left">
                            <span className="text-black font-serif font-bold text-sm block leading-tight truncate">
                              {item.name}
                            </span>
                            {item.variantName &&
                              item.variantName !== "Default Variant" && (
                                <span className="text-[9px] font-mono text-[#786F66] bg-[#EAE5D9]/40 border border-[#DCD6CC] px-2 py-0.5 rounded-md mt-1 inline-block font-semibold uppercase tracking-wider">
                                  {item.variantName}
                                </span>
                              )}
                          </div>

                          {/* Đơn giá nhân số lượng mộc mạc rõ nét */}
                          <div className="font-mono text-right shrink-0">
                            <span className="text-slate-500 mr-1.5">
                              ({formatVNDDirect(itemPrice)})
                            </span>
                            <span className="text-black font-bold">
                              × {item.quantity}
                            </span>
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
