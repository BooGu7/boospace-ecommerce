"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, Globe, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { contactFormSchema } from "@/lib/validators";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Xác thực dữ liệu Client
    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi bạn sớm nhất ✨",
        );
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Có lỗi xảy ra, vui lòng gửi lại sau.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-xs font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              03 / GET IN TOUCH
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Liên hệ
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Bạn muốn chế tác riêng, in 3D theo yêu cầu, hoặc kết nối hợp tác?
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="rounded-3xl border border-[#E1DDD5] bg-[#EAE5D9]/20 p-6 flex flex-col justify-between h-40">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#786F66]">
                  <Mail className="h-4 w-4" />
                  01 / Email
                </CardTitle>
                <CardDescription className="text-black font-bold text-lg mt-2 font-serif">
                  boospace7@gmail.com
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <a
                  href="mailto:boospace7@gmail.com"
                  className="text-xs text-blue-600 hover:underline font-mono"
                >
                  Gửi thư điện tử trực tiếp →
                </a>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E1DDD5] bg-[#EAE5D9]/20 p-6 flex flex-col justify-between h-40">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#786F66]">
                  <Globe className="h-4 w-4" />
                  02 / Website
                </CardTitle>
                <CardDescription className="text-black font-bold text-lg mt-2 font-serif">
                  https://boospace.tech
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <a
                  href="https://boospace.tech"
                  target="_blank"
                  rel="noopener"
                  className="text-xs text-blue-600 hover:underline font-mono"
                >
                  Trang chủ chính thức →
                </a>
              </CardContent>
            </Card>
          </div>

          {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
          <Card className="lg:col-span-2 rounded-3xl border border-[#E1DDD5] bg-white p-8">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-mono text-[#786F66] uppercase tracking-wider"
                    >
                      Tên của bạn
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nhập tên"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-[#E1DDD5]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-mono text-[#786F66] uppercase tracking-wider"
                    >
                      Hòm thư Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-[#E1DDD5]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className="text-xs font-mono text-[#786F66] uppercase tracking-wider"
                  >
                    Chủ đề cần tư vấn
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="In 3D theo yêu cầu / Chế tác kệ Sol-01"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#E1DDD5]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-xs font-mono text-[#786F66] uppercase tracking-wider"
                  >
                    Chi tiết nội dung ý tưởng
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Mô tả chi tiết ý tưởng hoặc sản phẩm cần gia công..."
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="rounded-xl border-[#E1DDD5]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs tracking-wider rounded-xl py-3 px-6 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Gửi tin nhắn
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
