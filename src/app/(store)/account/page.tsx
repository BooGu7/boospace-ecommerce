"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Settings, Heart, LogOut, User } from "lucide-react";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAuthStore } from "@/store/auth";
import { motion, Variants } from "framer-motion";

const accountLinks = [
  {
    name: "Đơn hàng",
    description: "Xem lịch sử đơn hàng và theo dõi vận chuyển thực tế",
    href: "/account/orders",
    icon: Package,
    index: "01",
  },
  {
    name: "Địa chỉ",
    description: "Quản lý địa chỉ giao hàng và thông tin thanh toán",
    href: "/account/addresses",
    icon: MapPin,
    index: "02",
  },
  {
    name: "Yêu thích",
    description: "Danh sách các thiết kế thủ công bạn đã lưu lại",
    href: "/wishlist",
    icon: Heart,
    index: "03",
  },
  {
    name: "Cài đặt",
    description: "Cập nhật thông tin tài khoản và tùy chọn cá nhân",
    href: "/account/settings",
    icon: Settings,
    index: "04",
  },
];

// Cấu hình Hoạt ảnh Spring chuẩn Daylight (Type-safe Variants)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 130, damping: 20 },
  },
  hover: {
    y: -6,
    borderColor: "#1E1C1A", // Viền đổi sang màu đen than chì khi hover
    boxShadow: "0 20px 40px -15px rgba(28, 28, 28, 0.08)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

export default function AccountPage() {
  const { user, isReady } = useAuthGuard();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  if (!isReady) return null;

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-[#E1DDD5] pb-8 mb-12 gap-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              04 / ACCOUNT PANEL
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Tài khoản
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider flex items-center gap-1">
              Chào mừng quay trở lại,{" "}
              <span className="font-bold text-black">
                {user?.firstName || "Khách hàng"}
              </span>
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-mono uppercase tracking-wider py-5 cursor-pointer shrink-0"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        {/* LƯỚI BENTO QUẢN TRỊ TÀI KHOẢN TÍCH HỢP HOẠT ẢNH THÁC ĐỔ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2"
        >
          {accountLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className="block h-full">
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="h-full cursor-pointer"
                >
                  <Card className="h-full border border-[#E1DDD5] bg-white rounded-3xl p-8 flex flex-col justify-between transition-colors shadow-xs">
                    {/* Card Header với chỉ số dẹt */}
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-[#FF9D00] font-bold">
                        {item.index} /
                      </span>
                      <Icon className="h-5 w-5 text-[#786F66]" />
                    </div>

                    {/* Card Content mộc mạc rõ nét */}
                    <div className="space-y-2 mt-12 text-left">
                      <h3 className="text-xl font-bold font-serif text-black leading-tight">
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
        </motion.div>
      </div>
    </div>
  );
}
