"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Tiến trình đăng ký bản tin gửi dữ liệu thực tế về Supabase
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Đăng ký nhận bản tin thành công! ✨");
        setEmail("");
      } else {
        toast.error(data.error || "Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error("Lỗi đăng ký bản tin:", err);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md gap-2">
      <input
        type="email"
        placeholder="Nhập email của bạn"
        aria-label="Email address for newsletter"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <Button variant="secondary" type="submit" disabled={loading}>
        {loading ? "..." : "Đăng ký"}
      </Button>
    </form>
  );
}
