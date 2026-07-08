"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Settings, Heart, LogOut } from "lucide-react";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAuthStore } from "@/store/auth"; // Import đầy đủ Store
import { useOrdersStore } from "@/store/orders";
import { useWishlistStore } from "@/store/wishlist";
import { motion, Variants } from "framer-motion";

// Cấu hình Hoạt ảnh Spring dẹt mượt mà (Type-safe Variants)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 130, damping: 20 },
  },
  hover: {
    y: -4,
    borderColor: "#1E1C1A",
    boxShadow: "0 20px 40px -15px rgba(28, 28, 28, 0.08)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

export default function AccountPage() {
  const { user, isReady } = useAuthGuard();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  // Đọc dữ liệu đơn hàng và danh sách yêu thích để hiển thị chỉ số động
  const orders = useOrdersStore((s) => s.orders);
  const wishlistItems = useWishlistStore((s) => s.items);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isReady) return null;

  // Ép kiểu an toàn để tránh báo lỗi "Property 'phone' does not exist on type 'User'"
  const userPhone = (user as any)?.phone;

  // Lọc số lượng đơn hàng thực tế
  const orderCount = mounted
    ? orders.filter((o) => o.customerEmail === user?.email).length
    : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  // Cấu hình danh sách các module bento điều khiển
  const accountLinks = [
    {
      name: "Đơn hàng của tôi",
      description: "Xem lịch sử đơn hàng, biên nhận và trạng thái vận chuyển",
      href: "/account/orders",
      icon: Package,
      index: "01",
      count: orderCount,
      countLabel: "đơn",
      iconClass: "group-hover:rotate-6",
    },
    {
      name: "Sổ địa chỉ nhận",
      description:
        "Quản lý danh sách địa chỉ giao hàng và thông tin thanh toán",
      href: "/account/addresses",
      icon: MapPin,
      index: "02",
      iconClass: "group-hover:scale-110",
    },
    {
      name: "Sản phẩm yêu thích",
      description: "Danh sách các thiết kế thủ công bạn đã lưu lại để xem sau",
      href: "/wishlist",
      icon: Heart,
      index: "03",
      count: wishlistCount,
      countLabel: "mục",
      iconClass: "group-hover:scale-110 group-hover:text-red-500",
    },
    {
      name: "Thiết lập tài khoản",
      description: "Cập nhật thông tin hồ sơ cá nhân và số điện thoại liên hệ",
      href: "/account/settings",
      icon: Settings,
      index: "04",
      iconClass: "group-hover:rotate-45",
    },
  ];

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              04 / MEMBER CONTROL PANEL
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Tài khoản
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider flex items-center gap-1.5">
              Chào mừng quay trở lại,{" "}
              <span className="font-bold text-[#FF9D00]">
                {user?.firstName || "Khách hàng"}
              </span>
            </p>
          </div>
        </div>

        {/* LƯỚI BENTO TRANG TRÍ HOẠT ẢNH THÁC ĐỔ (STAGGERED GRID) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* ==========================================
             MÔ-ĐUN TRÁI: THẺ HỒ SƠ THÀNH VIÊN ĐỘC BẢN
             ========================================== */}
          <motion.div
            variants={blockVariants}
            className="lg:col-span-4 bg-white border border-[#DCD6CC] rounded-[32px] p-8 space-y-6 text-left shadow-xs relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 size-36 rounded-full bg-gradient-radial from-[#FF8A00]/5 to-transparent blur-2xl" />

            <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-[#E1DDD5]/60 relative z-10">
              <div className="size-16 rounded-full bg-black flex items-center justify-center font-serif text-2xl font-bold text-white border border-[#DCD6CC] shadow-inner select-none uppercase">
                {user?.firstName?.[0] ?? "U"}
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-xl font-bold text-black leading-tight">
                  {user?.lastName} {user?.firstName}
                </h2>
                <span className="text-[10px] font-mono text-[#786F66] bg-[#EAE5D9]/40 border border-[#DCD6CC] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Thành viên xưởng mộc
                </span>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs text-[#5C564E] pt-2 text-left">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase text-[#786F66] block">
                  Địa chỉ Email
                </span>
                <p className="font-medium text-black break-all font-sans">
                  {user?.email}
                </p>
              </div>

              {userPhone && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase text-[#786F66] block">
                    Số điện thoại di động
                  </span>
                  <p className="font-medium text-black font-sans">
                    {userPhone}
                  </p>
                </div>
              )}
            </div>

            {/* Phím Đăng xuất */}
            <div className="pt-4 relative z-10">
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="w-full border-red-100 hover:bg-red-50 text-red-600 rounded-xl text-xs font-mono uppercase tracking-wider py-5 cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất tài khoản
              </Button>
            </div>
          </motion.div>

          {/* ==========================================
             MÔ-ĐUN PHẢI: LƯỚI PHÍM TẮT BENTO THÔNG MINH
             ========================================== */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {accountLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block h-full group"
                >
                  <motion.div
                    variants={blockVariants}
                    whileHover="hover"
                    animate="visible"
                    initial="hidden"
                    className="h-full cursor-pointer rounded-[32px] border border-[#DCD6CC]"
                  >
                    <Card className="h-full border-0 bg-white p-8 flex flex-col justify-between min-h-[190px] shadow-xs relative overflow-hidden transition-all rounded-[32px]">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono text-[#FF9D00] font-bold">
                          {item.index} /{" "}
                          {item.count !== undefined && (
                            <span className="text-black font-sans ml-1 text-[11px] font-semibold">
                              ({item.count} {item.countLabel})
                            </span>
                          )}
                        </span>

                        <div className="p-2.5 rounded-xl bg-[#FAF5F2] border border-[#E1DDD5]/60 transition-transform duration-300">
                          <Icon
                            className={`h-4.5 w-4.5 text-[#786F66] transition-all duration-300 ${item.iconClass}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-10 text-left">
                        <h3 className="text-lg font-bold font-serif text-black leading-tight flex items-center gap-1.5">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
