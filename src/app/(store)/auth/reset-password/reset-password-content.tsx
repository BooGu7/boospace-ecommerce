"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, Variants } from "framer-motion";

import { resetPassword } from "./action";

// Cấu hình Hoạt ảnh Spring mượt mà dẹt ngang (Type-safe Variants)
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

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      await resetPassword(token, password, confirmPassword);

      toast.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại ✨");

      router.push("/auth/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCardLayout
      title="Đặt lại mật khẩu"
      subtitle="Thiết lập mật khẩu bảo mật mới cho tài khoản của bạn"
      footerText="Quay lại đăng nhập?"
      footerLinkText="Đăng nhập ngay"
      footerLinkHref="/auth/login"
    >
      <motion.form
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-5 text-left"
      >
        {/* Khối nhập liệu Mật khẩu mới */}
        <motion.div variants={formItemVariants} className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
          >
            Mật khẩu mới
          </Label>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
          />
        </motion.div>

        {/* Khối xác nhận Mật khẩu mới */}
        <motion.div variants={formItemVariants} className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
          >
            Xác nhận mật khẩu mới
          </Label>

          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
          />
        </motion.div>

        {/* Nút Đổi mật khẩu dẹt lớn cam hổ phách */}
        <motion.div variants={formItemVariants} className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                Đang cập nhật mật mã...
              </>
            ) : (
              "Xác nhận đổi mật khẩu"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthCardLayout>
  );
}
