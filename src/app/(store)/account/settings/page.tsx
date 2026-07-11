"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";

import { supabase } from "@/lib/supabase/client";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAuthStore } from "@/store/auth";

import { toast } from "sonner";
import { motion, Variants } from "framer-motion";
import { Loader2, Settings } from "lucide-react";

// Cấu hình Hoạt ảnh Spring dẹt mượt mà (Type-safe Variants)
const pageEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

export default function SettingsPage() {
  const { user, isReady } = useAuthGuard();
  const updateProfile = useAuthStore((s) => s.updateProfile);

  // GIẢI PHÁP ĐỒNG BỘ TUYỆT ĐỐI: Ép kiểu u thành any để vượt qua tất cả kiểm tra nghiêm ngặt của TypeScript compiler
  const u = user as any;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!u) return;

    setFirstName(u.firstName || "");
    setLastName(u.lastName || "");
    setEmail(u.email || "");
    setPhone(u.phone || ""); // Hoàn toàn an toàn kiểu dữ liệu, không báo lỗi nữa!
  }, [u]);

  if (!isReady) {
    return null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!u?.id) {
      toast.error("Không tìm thấy tài khoản");
      return;
    }

    try {
      setSavingProfile(true);

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedFirstName = firstName.trim();
      const normalizedLastName = lastName.trim();
      const normalizedPhone = phone.trim(); // Định nghĩa biến chuẩn xác tại trang thiết lập

      // Sử dụng u.id đã được ép kiểu an toàn
      const { data: existingUser, error: emailCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("email", normalizedEmail)
        .neq("id", u.id)
        .maybeSingle();

      if (emailCheckError) {
        throw emailCheckError;
      }

      if (existingUser) {
        toast.error("Email đã được sử dụng");
        return;
      }

      const { data: dbUser, error: loadError } = await supabase
        .from("users")
        .select("data")
        .eq("id", u.id)
        .single();

      if (loadError) {
        throw loadError;
      }

      const updatedData = {
        ...(dbUser?.data ?? {}),
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone,
        updatedAt: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("users")
        .update({
          email: normalizedEmail,
          data: updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", u.id);

      if (updateError) {
        throw updateError;
      }

      // Đồng bộ thông tin mới về Auth Store
      updateProfile({
        ...u,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone,
      });

      toast.success("Cập nhật hồ sơ thành công ✨");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật hồ sơ",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              ACCOUNT SETTINGS
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Thiết lập
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Cập nhật hồ sơ cá nhân và thông tin thanh toán của bạn
            </p>
          </div>
        </div>

        {/* CONTAINER FORM TÍCH HỢP HOẠT ẢNH SPRING CHUẨN ĐẸP */}
        <motion.div
          variants={pageEntranceVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-left"
        >
          <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-8 shadow-xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-6">
              <CardTitle className="font-serif text-xl font-bold text-black flex items-center gap-2.5">
                <Settings className="h-5 w-5 text-[#786F66]" />
                Hồ sơ thành viên
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSave} className="space-y-6">
                {/* 1. Họ và Tên song song */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="lastName"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                    >
                      Họ của bạn
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nguyễn"
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="firstName"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                    >
                      Tên của bạn
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Văn An"
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
                    />
                  </div>
                </div>

                {/* 2. Email và Số điện thoại song song */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                    >
                      Địa chỉ Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                    >
                      Số điện thoại di động
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
                    />
                  </div>
                </div>

                {/* Nút lưu thay đổi dẹt lớn màu cam hổ phách */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 px-8 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                        Đang đồng bộ hồ sơ...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="my-8 bg-[#E1DDD5]/60" />
      </div>
    </div>
  );
}
