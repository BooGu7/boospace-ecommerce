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

const accountLinks = [
  {
    name: "Đơn hàng",
    description: "Xem lịch sử đơn hàng và theo dõi vận chuyển",
    href: "/account/orders",
    icon: Package,
    index: "01",
  },
  {
    name: "Địa chỉ",
    description: "Quản lý địa chỉ giao hàng và thanh toán",
    href: "/account/addresses",
    icon: MapPin,
    index: "02",
  },
  {
    name: "Yêu thích",
    description: "Các sản phẩm bạn đã lưu để xem sau",
    href: "/wishlist",
    icon: Heart,
    index: "03",
  },
  {
    name: "Cài đặt",
    description: "Cập nhật thông tin cá nhân và tùy chọn",
    href: "/account/settings",
    icon: Settings,
    index: "04",
  },
];

export default function AccountPage() {
  const { user, isReady } = useAuthGuard();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  if (!isReady) return null;

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
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
            className="border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-mono uppercase tracking-wider"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        {/* LƯỚI BENTO QUẢN TRỊ TÀI KHOẢN */}
        <div className="grid gap-6 sm:grid-cols-2">
          {accountLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <Card className="h-full border border-[#E1DDD5] hover:border-black rounded-3xl p-8 flex flex-col justify-between transition-all bg-white shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-[#FF9D00] font-bold">
                      {item.index} /
                    </span>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2 mt-8">
                    <h3 className="text-xl font-bold font-serif text-black">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
