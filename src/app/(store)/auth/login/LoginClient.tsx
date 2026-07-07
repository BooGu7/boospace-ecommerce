"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link"; // Đã bổ sung dòng import chuẩn xác

import { loginSchema } from "@/lib/validators";
import { useAuthStore } from "@/store/auth";

import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, Variants } from "framer-motion";

// Cấu hình Hoạt ảnh Spring mượt mà cho các phần tử Form (Type-safe Variants)
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Hiển thị thông báo khi Email được xác thực thành công
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email đã được xác thực thành công, hãy đăng nhập!");
    }
  }, [searchParams]);

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

      // ✅ Quay về trang chủ và làm mới trạng thái
      router.push("/");
      router.refresh();
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
      <motion.form
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-5 text-left"
      >
        {/* Khối nhập liệu Email */}
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

        {/* Khối nhập liệu Mật khẩu */}
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

        {/* Nút bấm Submit Đăng nhập dẹt lớn hổ phách */}
        <motion.div variants={formItemVariants} className="pt-2">
          <Button
            type="submit"
            disabled={loading}
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
      </motion.form>
    </AuthCardLayout>
  );
}
