"use client";

import { motion, type Variants } from "framer-motion";
import { Loader2, Lock, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    setPhone(u.phone || "");
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
      const normalizedPhone = phone.trim();

      // Nạp dữ liệu hiện tại (Dùng maybeSingle() tránh lỗi PGRST116 khi không tìm thấy dòng nào)
      const { data: dbUser } = await supabase.from("users").select("data").eq("id", u.id).maybeSingle();

      const updatedData = {
        ...(dbUser?.data ?? {}),
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone,
        updatedAt: new Date().toISOString(),
      };

      // Dùng upsert để tạo mới hoặc cập nhật bản ghi trong bảng public.users
      const { error: updateError } = await supabase.from("users").upsert({
        id: u.id,
        email: normalizedEmail,
        data: updatedData,
        updated_at: new Date().toISOString(),
      });

      if (updateError) {
        throw updateError;
      }

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
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật hồ sơ");
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
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

        <motion.div variants={pageEntranceVariants} initial="hidden" animate="visible" className="max-w-3xl text-left">
          <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-8 shadow-xs">
            <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-6">
              <CardTitle className="font-serif text-xl font-bold text-black flex items-center gap-2.5">
                <Settings className="h-5 w-5 text-[#786F66]" />
                Hồ sơ thành viên
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSave} className="space-y-6">
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
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
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
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ô Email đã được KHÓA CHỈNH SỬA */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider flex items-center gap-1.5"
                    >
                      Địa chỉ Email <Lock className="size-3 text-[#786F66]" />
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      readOnly
                      className="rounded-xl border-[#E1DDD5] bg-[#EAE5D9]/30 text-sm text-[#786F66] font-sans font-medium px-4 py-2.5 cursor-not-allowed select-none"
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
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
                    />
                  </div>
                </div>

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
