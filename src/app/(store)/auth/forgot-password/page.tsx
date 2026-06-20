"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Reset link sent (demo)");
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

        <Button type="submit" className="w-full">
          Gửi link đặt lại
        </Button>
      </form>
    </AuthCardLayout>
  );
}
