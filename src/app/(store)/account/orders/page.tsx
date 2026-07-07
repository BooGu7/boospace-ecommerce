"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Package, CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useOrdersStore } from "@/store/orders";
import { formatPrice, formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const { user, isReady } = useAuthGuard();
  const orders = useOrdersStore((s) => s.orders);

  if (!isReady) return null;

  // Lọc danh sách đơn hàng đồng bộ theo email tài khoản từ Store
  const userOrders = user
    ? orders.filter((o) => o.customerEmail === user.email)
    : orders;

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit font-bold">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              06 / ORDERS HISTORY
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Đơn hàng của tôi
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Lịch sử các hóa đơn giao dịch của tài khoản
            </p>
          </div>
        </div>

        {userOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Chưa có đơn hàng nào"
            description="Khi bạn đặt hàng, đơn hàng sẽ xuất hiện tại đây."
            actionLabel="Bắt đầu mua sắm"
            actionHref="/shop"
          />
        ) : (
          /* DANH SÁCH ĐƠN HÀNG HOẠT ĐỘNG ỔN ĐỊNH */
          <div className="mt-8 space-y-4 max-w-4xl mx-auto text-left">
            {userOrders.map((order) => (
              <Card
                key={order.id}
                className="rounded-3xl border border-[#E1DDD5] bg-white shadow-xs"
              >
                <CardContent className="p-6 pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold text-black uppercase tracking-wider">
                        Mã đơn: #{order.orderNumber}
                      </p>
                      <p className="text-xs text-[#786F66] mt-1 flex items-center gap-1.5 font-mono">
                        <CalendarDays className="size-3.5" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Thẻ trạng thái gốc tương thích kiểu dữ liệu OrderStatus */}
                      <OrderStatusBadge status={order.status} />
                      <span className="text-base font-mono font-bold text-[#FF9D00]">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs font-mono text-[#786F66] uppercase border-t border-slate-100 pt-4">
                    {order.items.map((item) => (
                      <span key={item.id} className="mr-4">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
