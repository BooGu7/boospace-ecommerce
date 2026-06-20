"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Mail, Globe, GitFork } from "lucide-react";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success(
        "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi bạn sớm nhất ✨",
      );
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 500);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader
        title="Liên hệ"
        description="Bạn có câu hỏi về hỗ trợ tùy chỉnh, hoặc muốn hợp tác? Chúng tôi rất vui được lắng nghe bạn ✨"
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Contact info cards */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:boospace7@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                boospace7@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="https://boospace.tech"
                target="_blank"
                rel="noopener"
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                https://boospace.tech
              </a>
            </CardContent>
          </Card>
          {/* 
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <GitFork className="h-4 w-4" />
                GitHub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="https://github.com/Epic-Design-Labs/nextjs-ecommerce-starter"
                target="_blank"
                rel="noopener"
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                Xem trên GitHub
              </a>
            </CardContent>
          </Card> */}
        </div>

        {/* Contact form */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tên của bạn"
                    value={form.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Chủ đề</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Câu hỏi, hỗ trợ hoặc yêu cầu hợp tác"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nội dung</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Hãy chia sẻ chi tiết câu hỏi hoặc dự án của bạn..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi tin nhắn"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
