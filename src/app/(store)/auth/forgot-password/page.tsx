"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { toast } from "sonner";

import { forgotPassword } from "./action";

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
        "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu 📨",
      );

      setEmail("");

      // local testing
      if (result.resetUrl) {
        router.push(result.resetUrl);
      }
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
      footerLinkText="Đăng nhập"
      footerLinkHref="/auth/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi link"}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
