"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { toast } from "sonner";
import { motion, Variants } from "framer-motion";
import { Loader2 } from "lucide-react";

import { forgotPassword } from "./action";

// Cấu hình hoạt ảnh Spring dẹt mượt mà (Type-safe Variants)
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

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await forgotPassword(email);

      toast.success(
        "Yêu cầu thành công! Chúng tôi đã gửi link đặt lại mật khẩu tới Gmail của bạn.",
      );

      setEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCardLayout
      title="Đặt lại mật khẩu"
      subtitle="Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu"
      footerText="Nhớ lại mật khẩu rồi?"
      footerLinkText="Quay lại đăng nhập"
      footerLinkHref="/auth/login"
    >
      <motion.form
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-5 text-left"
      >
        <motion.div variants={formItemVariants} className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
          >
            Địa chỉ Email khôi phục
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium focus-visible:ring-1 focus-visible:ring-[#FF9D00] bg-white px-4 py-2.5"
          />
        </motion.div>

        {/* Nút bấm gửi yêu cầu dẹt lớn hổ phách */}
        <motion.div variants={formItemVariants} className="pt-2">
          <Button
            type="submit"
            className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                Đang gửi yêu cầu...
              </>
            ) : (
              "Gửi liên kết khôi phục"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthCardLayout>
  );
}
