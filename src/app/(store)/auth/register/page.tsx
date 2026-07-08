"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Loader2, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { registerUser } from "./action";

// Cấu hình Hoạt ảnh Spring chuẩn Daylight (Type-safe Variants)
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
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Quản lý màn hình hướng dẫn check Gmail

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

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
        setIsSubmitted(true); // Chuyển đổi sang giao diện check Gmail thành công
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
          /* ============================================================================
             TRẠNG THÁI 1: FORM NHẬP ĐĂNG KÝ HOẠT ẢNH STAGGERED FADE-UP
             ============================================================================ */
          <motion.form
            key="register-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="space-y-4 text-left"
          >
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
                disabled={loading}
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
          </motion.form>
        ) : (
          /* ============================================================================
             TRẠNG THÁI 2: MÀN HÌNH BIÊN NHẬN CHÚC MỪNG & CHỈ DẪN CHECK GMAIL ĐỘC ĐẢO
             ============================================================================ */
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 20 }}
            className="text-left space-y-6 py-4"
          >
            {/* Vòng nhịp thở icon Mail phát sáng của Daylight */}
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

            {/* Khung chỉ dẫn chi tiết mộc mạc và chân thực */}
            <p className="text-xs sm:text-sm leading-relaxed text-[#5c544d] bg-[#fbf9f4] border border-[#e8e2d2] rounded-2xl p-5 italic text-left">
              &quot;Một liên kết kích hoạt tài khoản vừa được gửi tới hòm thư{" "}
              <strong className="text-black not-italic font-bold">
                {form.email}
              </strong>
              . Bạn hãy mở ứng dụng Gmail, kiểm tra Hộp thư đến (hoặc hòm thư
              Rác - Spam) và nhấp vào liên kết để chính thức kích hoạt tài khoản
              trước khi đăng nhập nhé ✨&quot;
            </p>

            {/* Nút bấm dẹt lớn chuyển tiếp nhanh sang ứng dụng Mail Google */}
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
