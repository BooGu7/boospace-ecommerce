"use client";

import { useState, useRef } from "react";
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
import { Mail, Send, Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { contactFormSchema } from "@/lib/validators";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/config";

// TỰ DỰNG BIỂU TƯỢNG SOCIAL ICONS ĐỂ TRÁNH LỖI PHIÊN BẢN (Type-safe)
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

// Cấu hình Hoạt ảnh Spring mượt mà dẹt ngang (Type-safe)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 130, damping: 20 },
  },
  hover: {
    y: -4,
    borderColor: "#1E1C1A",
    boxShadow: "0 15px 30px -10px rgba(28, 28, 28, 0.06)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // States quản lý file đính kèm 3D (.stl, .obj...) tối đa 5MB
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Xử lý khi khách chọn file đính kèm (Giới hạn nghiêm ngặt 5MB)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      toast.error(
        "Dung lượng tệp vượt quá giới hạn 5MB. Vui lòng chọn tệp nhỏ hơn.",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setAttachedFile(file);
  }

  function handleRemoveFile() {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Xác thực dữ liệu Client
    const result = contactFormSchema.safeParse({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    let uploadedFileUrl = "";

    try {
      // 1. Tiến hành tải tệp đính kèm lên Supabase Storage co-creation-files (nếu có)
      if (attachedFile) {
        const fileExt = attachedFile.name.split(".").pop();
        const fileName = `contact/${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("co-creation-files")
          .upload(fileName, attachedFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("co-creation-files").getPublicUrl(fileName);

        uploadedFileUrl = publicUrl;
      }

      // 2. Gửi dữ liệu yêu cầu báo giá qua Resend API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: `SĐT: ${form.phone || "N/A"}\nNội dung liên hệ: ${form.message}${uploadedFileUrl ? `\nTệp đính kèm từ khách hàng: ${uploadedFileUrl}` : ""}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          "Gửi tin nhắn liên hệ thành công! Chúng tôi sẽ phản hồi bạn sớm nhất ✨",
        );
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        handleRemoveFile();
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
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              GET IN TOUCH
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Liên hệ
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Bạn muốn chế tác riêng, in 3D theo yêu cầu, hoặc kết nối hợp tác?
            </p>
          </div>
        </div>

        {/* LƯỚI HOẠT ẢNH BENTO FADE-UP */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-3 items-start"
        >
          {/* CỘT TRÁI (1/3): THÔNG TIN LIÊN HỆ ĐA KÊNH */}
          <div className="space-y-6 lg:col-span-1 text-left">
            {/* Card Email */}
            <motion.div
              variants={blockVariants}
              whileHover="hover"
              className="block"
            >
              <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 flex flex-col justify-between h-40 relative overflow-hidden transition-all">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#786F66] font-bold">
                    <Mail className="h-4 w-4 text-[#FF9D00]" />
                    Email liên hệ
                  </CardTitle>
                  <CardDescription className="text-black font-bold text-lg mt-3 font-serif">
                    {siteConfig.contact.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-xs text-blue-600 hover:underline font-mono"
                  >
                    Gửi thư điện tử trực tiếp →
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card Mạng Xã Hội */}
            <motion.div
              variants={blockVariants}
              whileHover="hover"
              className="block"
            >
              <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 flex flex-col justify-between h-40 relative overflow-hidden transition-all">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#786F66] font-bold">
                    {/* Đã sửa lỗi: Gỡ bỏ thuộc tính strokeWidth="0" gây lỗi biên dịch */}
                    <IconInstagram className="h-4 w-4 text-[#FF9D00]" />
                    Kênh kết nối
                  </CardTitle>
                  <CardDescription className="text-black font-bold text-sm mt-3 font-serif leading-relaxed">
                    Theo dõi Boo Space qua các nền tảng mạng xã hội hằng ngày.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex gap-5 text-[#786F66]">
                  {siteConfig.social.instagram && (
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener"
                      className="hover:text-black transition-colors"
                      aria-label="Instagram"
                    >
                      <IconInstagram className="h-5 w-5" />
                    </a>
                  )}
                  {siteConfig.social.facebook && (
                    <a
                      href={siteConfig.social.facebook}
                      target="_blank"
                      rel="noopener"
                      className="hover:text-black transition-colors"
                      aria-label="Facebook"
                    >
                      <IconFacebook className="h-5 w-5" />
                    </a>
                  )}
                  {siteConfig.social.tiktok && (
                    <a
                      href={siteConfig.social.tiktok}
                      target="_blank"
                      rel="noopener"
                      className="hover:text-black transition-colors"
                      aria-label="TikTok"
                    >
                      <IconTikTok className="h-5 w-5" />
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CỘT PHẢI (2/3): FORM GỬI TIN NHẮN TÍCH HỢP TẢI FILE 3D & SĐT ĐỒNG BỘ */}
          <motion.div
            variants={blockVariants}
            className="lg:col-span-2 text-left"
          >
            <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-8 shadow-xs">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Họ tên & Email song song */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
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
                        className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
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
                        className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                      />
                    </div>
                  </div>

                  {/* SĐT liên hệ & Chủ đề tư vấn song song */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                      >
                        Số điện thoại di động
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="09xx xxx xxx"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                      >
                        Chủ đề cần tư vấn
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="In 3D theo yêu cầu / Chế tác thiết kế riêng"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider"
                    >
                      Chi tiết nội dung ý tưởng
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Mô tả chi tiết ý tưởng thiết kế hoặc dán liên kết tệp in của bạn..."
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium resize-none"
                    />
                  </div>

                  {/* NÂNG CẤP BỘ LỌC ĐÍNH KÈM TỆP 3D & BẢN VẼ PHONG PHÚ (.3MF, .DWG, .STEP...) */}
                  <div className="space-y-2 text-left">
                    <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider block">
                      Tệp đính kèm STL / 3MF / DWG / STEP / Bản vẽ phác thảo
                      (Nếu có) (Tối đa 5MB)
                    </Label>

                    {!attachedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center border border-dashed border-[#CFCABF] rounded-2xl p-4 bg-[#FCFAF2]/30 hover:bg-[#FCFAF2]/60 hover:border-[#FF9D00]/50 cursor-pointer transition-colors"
                      >
                        <Upload className="h-5 w-5 text-[#786F66] mb-1" />
                        <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider">
                          Đính kèm file in 3D / Bản vẽ CAD
                        </span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".stl,.obj,.3mf,.dwg,.step,.stp,.dxf,.f3d,.png,.jpg,.jpeg" // Đã bổ sung .3mf, .dwg, .step đầy đủ
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative border border-[#CFCABF] rounded-2xl p-3 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-black font-bold max-w-[280px] truncate">
                            {attachedFile?.name}
                          </span>
                          <span className="text-[9px] font-mono text-[#786F66] bg-[#EAE5D9]/50 px-2 py-0.5 rounded-md">
                            {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 px-8 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-black" />
                          Đang gửi yêu cầu...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Gửi tin nhắn liên hệ
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
