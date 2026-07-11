"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Loader2, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { registerUser } from "./action";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";

function IconGoogle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 20 },
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ ĐỒNG BỘ ĐIỀU HƯỚNG CHUẨN XÁC: Đẩy khách về Trang chủ (/) ngay khi đăng ký Google thành công [21]
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
      router.refresh();
    }
  }, [isAuthenticated, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối đến Google.");
      setGoogleLoading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(form);
      if (result.success) {
        setIsSubmitted(true);
        toast.success("Tạo yêu cầu tài khoản thành công! ✨");
      }
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCardLayout
      title={isSubmitted ? "Xác thực Gmail" : "Đăng ký tài khoản"}
      subtitle={
        isSubmitted
          ? "Kích hoạt không gian cá nhân của bạn"
          : "Tạo tài khoản để may đo và tùy chỉnh Workspace riêng của bạn"
      }
      footerText={
        isSubmitted ? "Chưa nhận được Email?" : "Bạn đã có tài khoản?"
      }
      footerLinkText={isSubmitted ? "Thử gửi lại yêu cầu" : "Đăng nhập ngay"}
      footerLinkHref={isSubmitted ? "/auth/forgot-password" : "/auth/login"}
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="register-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-5"
          >
            <motion.div variants={itemVariants}>
              <Button
                type="button"
                onClick={handleGoogleRegister}
                disabled={googleLoading || loading}
                className="w-full bg-white hover:bg-neutral-50 text-black border border-[#CFCABF] font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2.5 shadow-sm"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                ) : (
                  <IconGoogle className="h-4.5 w-4.5 shrink-0" />
                )}
                Đăng ký với Google
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 py-1"
            >
              <Separator className="flex-1 bg-[#E1DDD5]" />
              <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                Hoặc điền thủ công
              </span>
              <Separator className="flex-1 bg-[#E1DDD5]" />
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                    Họ
                  </Label>
                  <Input
                    name="lastName"
                    placeholder="Nguyễn"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                    Tên
                  </Label>
                  <Input
                    name="firstName"
                    placeholder="An"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                  Địa chỉ Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                  Mật khẩu
                </Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Tối thiểu 8 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium bg-white px-4 py-2.5"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      Đang thiết lập...
                    </>
                  ) : (
                    "Xác nhận đăng ký"
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        ) : (
          /* TRẠNG THÁI 2: MÀN HÌNH BIÊN NHẬN CHÚC MỪNG & CHỈ DẪN CHECK GMAIL */
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 20 }}
            className="text-left space-y-6 py-4"
          >
            <div className="flex justify-center py-2">
              <div className="rounded-full bg-[#3ECF8E]/10 p-5 border border-[#3ECF8E]/25 animate-pulse">
                <Mail className="h-10 w-10 text-[#3ECF8E] stroke-[1.25]" />
              </div>
            </div>

            <div className="space-y-3 text-center">
              <h3 className="font-serif text-2xl font-bold text-black tracking-tight leading-none">
                Đăng ký thành công!
              </h3>
              <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                Tụi mình đã gửi thư xác thực tới Gmail
              </p>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-[#5c544d] bg-[#fbf9f4] border border-[#e8e2d2] rounded-2xl p-5 italic text-left">
              &quot;Một liên kết kích hoạt tài khoản vừa được gửi tới hòm thư{" "}
              <strong className="text-black not-italic font-bold">
                {form.email}
              </strong>
              . Bạn hãy mở ứng dụng Gmail, kiểm tra Hộp thư đến (hoặc hòm thư
              Rác - Spam) và nhấp vào liên kết để chính thức kích hoạt tài khoản
              trước khi đăng nhập nhé ✨&quot;
            </p>

            <div className="space-y-3 pt-2">
              <Button
                asChild
                className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mở ứng dụng Gmail{" "}
                  <ExternalLink className="h-3.5 w-3.5 text-black" />
                </a>
              </Button>

              <Link
                href="/"
                className="text-xs font-mono text-[#786F66] hover:text-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors pt-2 block text-center"
              >
                Quay lại trang chủ <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCardLayout>
  );
}
