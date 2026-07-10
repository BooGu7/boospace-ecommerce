"use client";

import { useState, useRef } from "react";
import {
  Search,
  FileText,
  Sparkles,
  Loader2,
  Upload,
  Trash2,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// Cấu hình Hoạt ảnh Spring mượt mà cho các Card (Type-safe Variants)
const bentoContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const bentoCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 22 },
  },
  hover: {
    y: -6,
    boxShadow: "0 20px 40px -15px rgba(0, 225, 155, 0.15)",
    borderColor: "rgba(0, 225, 155, 0.3)", // Glow viền xanh Neon nhẹ khi hover
    transition: { type: "spring", stiffness: 300, damping: 18 },
  },
};

export function BentoPortalGrid() {
  const router = useRouter();

  // States cho Form gửi ý tưởng in 3D (Thẻ số 2)
  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // States quản lý file đính kèm 3D (.stl, .obj...) tối đa 5MB
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States cho Form tìm kiếm AI nhanh (Thẻ số 1)
  const [searchQuery, setSearchQuery] = useState("");

  // Xử lý khi khách chọn file đính kèm (Giới hạn nghiêm ngặt 5MB)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      toast.error(
        "Tệp vượt quá dung lượng 5MB. Vui lòng chọn tệp nhỏ hơn hoặc gửi trực tiếp qua email cho chúng tôi.",
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

  // Chuyển hướng người dùng sang trang /search khi gõ từ khóa tìm kiếm AI
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  }

  // Hàm xử lý gửi ý tưởng & tệp in 3D về Supabase DB & kích hoạt gửi mail báo giá qua Resend
  async function handleSubmitIdea(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim() || !email.trim()) {
      toast.error("Vui lòng điền đầy đủ ý tưởng và email liên hệ.");
      return;
    }

    setSubmitting(true);
    let uploadedFileUrl = "";

    try {
      // 1. Tiến hành tải ảnh lên Supabase Storage nếu có đính kèm
      if (attachedFile) {
        const fileExt = attachedFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("co-creation-files")
          .upload(fileName, attachedFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("co-creation-files").getPublicUrl(fileName);

        uploadedFileUrl = publicUrl;
      }

      // 2. Gửi dữ liệu về API liên hệ chung để đồng bộ Supabase & bắn Email thông báo
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Khách hàng Ý Tưởng Độc Bản",
          email: email,
          subject: "Yêu cầu báo giá thiết kế in 3D On-Demand",
          message: `Ý tưởng: ${idea}${uploadedFileUrl ? `\nTệp đính kèm: ${uploadedFileUrl}` : ""}`,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(
          "Boo đã tiếp nhận! Báo giá chi tiết sẽ được gửi lại bạn sớm ✨",
        );
        setIdea("");
        setEmail("");
        handleRemoveFile();
      } else {
        toast.error(data.error || "Gửi ý tưởng thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      variants={bentoContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid gap-6 md:grid-cols-3 w-full bg-[#151513] p-6 rounded-[36px] border border-white/5 dark-mesh-pattern select-none"
    >
      {/* ==========================================
         CARD 01 (Chiếm 2 cột): TÌM KIẾM Ý TƯỞNG BẰNG AI (KÍCH HOẠT TƯƠNG TÁC THỰC TẾ)
         ========================================== */}
      <motion.div
        variants={bentoCardVariants}
        whileHover="hover"
        className="col-span-1 md:col-span-2 bg-[#181816]/90 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col justify-between min-h-[380px] text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between text-[#00E19B]">
          <span className="text-xs font-mono tracking-widest font-semibold uppercase">
            TÌM KIẾM Ý TƯỞNG BẰNG AI
          </span>
          <Search className="h-4 w-4" />
        </div>

        {/* Input Tìm kiếm kích hoạt chuyển hướng */}
        <form onSubmit={handleSearchSubmit} className="relative my-6 w-full">
          <input
            type="text"
            placeholder="Tìm đèn, chậu cây hoặc màu sắc phù hợp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#242421] border border-white/10 rounded-full py-4 pl-6 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00E19B] transition-all font-sans"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00E19B] hover:text-white cursor-pointer transition-colors"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
          TÌM KIẾM GÓC BÌNH YÊN CỦA BẠN
        </div>
      </motion.div>

      {/* ==========================================
         CARD 02 (Chiếm 1 cột): Ý TƯỞNG ĐỘC BẢN (CO-CREATION) (ĐÃ SỬA LỖI ĐỒNG BỘ ATTACHEDFILE)
         ========================================== */}
      <motion.div
        variants={bentoCardVariants}
        whileHover="hover"
        className="col-span-1 bg-[#181816]/90 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col justify-between min-h-[380px] text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between text-[#00E19B]">
          <span className="text-xs font-mono tracking-widest font-semibold uppercase">
            Ý TƯỞNG ĐỘC BẢN (CO-CREATION)
          </span>
          <FileText className="h-4 w-4" />
        </div>

        {/* Form nhập liệu kèm đính kèm file */}
        <form
          onSubmit={handleSubmitIdea}
          className="space-y-3.5 my-4 flex-1 flex flex-col justify-center"
        >
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Dán liên kết file hoặc mô tả chi tiết ý tưởng của bạn tại đây..."
            rows={2}
            required
            className="w-full bg-[#242421] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00E19B] transition-all font-sans resize-none"
          />

          <div className="grid grid-cols-1 gap-2.5">
            {/* Trường đính kèm tệp */}
            {!attachedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 border border-dashed border-white/10 rounded-xl py-2 bg-[#242421]/60 hover:bg-[#242421] hover:border-[#00E19B]/40 cursor-pointer transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-[#00E19B]" />
                <span className="text-[10px] font-mono text-[#00E19B] uppercase tracking-wider">
                  Đính kèm file 3D
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".stl,.obj,.gltf,.glb,.png,.jpg,.jpeg"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border border-white/10 rounded-xl px-4 py-2 bg-[#242421] flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/70 max-w-[150px] truncate">
                  {attachedFile?.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Hòm thư email liên hệ..."
              required
              className="w-full bg-[#242421] border border-white/5 rounded-2xl px-4 py-2.5 text-xs outline-none text-white placeholder:text-[#786F66]/65 font-sans"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-[#00E19B] hover:bg-[#00C281] text-black font-semibold rounded-2xl py-3 tracking-widest text-[10px] font-mono uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                ĐANG TRUYỀN...
              </>
            ) : (
              "GỬI Ý TƯỞNG"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
          Báo giá sẽ gửi lại bạn sớm nhất
        </div>
      </motion.div>
    </motion.div>
  );
}
