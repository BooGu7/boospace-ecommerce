"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { loginSchema } from "@/lib/validators";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/lib/supabase/client";

import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, Variants } from "framer-motion";

// BIỂU TƯỢNG GOOGLE VECTOR
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

const formContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const formItemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 20 },
  },
};

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ĐỒNG BỘ ĐIỀU HƯỚNG CHUẨN XÁC: Tự động chuyển vùng đưa khách về Trang chủ (/) ngay khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
      router.refresh();
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email đã được xác thực thành công, hãy đăng nhập!");
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Đăng nhập thất bại");
        return;
      }

      setUser(data.user);
      toast.success(`Chào mừng trở lại, ${data.user.firstName} ✨`);
    } catch (err) {
      toast.error("Có lỗi xảy ra trong quá trình kết nối.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCardLayout
      title="Chào mừng bạn"
      subtitle="Đăng nhập để kết nối không gian sáng tạo"
      footerText="Bạn chưa có tài khoản?"
      footerLinkText="Đăng ký tài khoản mới"
      footerLinkHref="/auth/register"
    >
      <motion.div
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5"
      >
        <motion.div variants={formItemVariants}>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full bg-white hover:bg-neutral-50 text-black border border-[#CFCABF] font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2.5 shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <IconGoogle className="h-4.5 w-4.5 shrink-0" />
            )}
            Tiếp tục với Google
          </Button>
        </motion.div>

        <motion.div
          variants={formItemVariants}
          className="flex items-center gap-3 py-1"
        >
          <Separator className="flex-1 bg-[#E1DDD5]" />
          <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
            Hoặc sử dụng email
          </span>
          <Separator className="flex-1 bg-[#E1DDD5]" />
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <motion.div variants={formItemVariants} className="space-y-1.5">
            <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
              Địa chỉ Email
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
              className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
            />
          </motion.div>

          <motion.div variants={formItemVariants} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                Mật khẩu mật mã
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] font-mono text-[#786F66] hover:text-[#FF9D00] transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
              className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
            />
          </motion.div>

          <motion.div variants={formItemVariants} className="pt-2">
            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  Đang xác thực...
                </>
              ) : (
                "Xác nhận đăng nhập"
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </AuthCardLayout>
  );
}
