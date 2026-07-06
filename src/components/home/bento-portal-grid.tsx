"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";

export function BentoPortalGrid() {
  const [idea, setIdea] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authSubmitted, setAuthSubmitted] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<any[]>([]);

  // Tiến trình gửi ý tưởng thiết kế đồng thời lưu Supabase và Kích hoạt gửi Mail thông báo qua Resend
  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      toast.error("Vui lòng điền nội dung ý tưởng của bạn");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("Vui lòng nhập địa chỉ hòm thư Email hợp lệ");
      return;
    }

    setAuthLoading(true);
    try {
      // Gửi yêu cầu dạng POST tới API contact chung để xử lý đồng bộ
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Khách hàng Hòm thư góp ý kiến",
          email: email,
          subject: "Ý tưởng chế tác in 3D mới gửi từ Hòm thư góp ý kiến",
          message: idea,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthSubmitted(true);
        toast.success(
          "Boo Space đã ghi nhận ý tưởng thiết kế tuyệt vời và gửi thông báo về Email!",
        );
      } else {
        toast.error(
          data.error || "Gửi ý tưởng thất bại, vui lòng gửi lại sau.",
        );
      }
    } catch (err: any) {
      console.error("Lỗi gửi ý tưởng:", err);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Tiến trình tìm kiếm ngữ nghĩa bằng AI gọi RPC pgvector
  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResult(data.products || []);
    } catch (err) {
      console.error("Lỗi tìm kiếm AI:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#111111] p-8 rounded-3xl border border-white/10 relative overflow-hidden select-none">
      {/* Nền ma trận chấm tinh tế */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF5F2_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* THẺ 1 (Chiếm 2 cột trên Desktop): SEMANTIC SEARCH BENTO BLOCK */}
      <div className="col-span-1 md:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between min-h-[20rem] relative z-10">
        <div className="flex justify-between items-start">
          <span className="text-xs font-mono text-[#3ECF8E] font-bold">
            01 / TÌM KIẾM Ý TƯỞNG BẰNG AI
          </span>
          <Search className="size-4 text-[#3ECF8E]" />
        </div>

        <form onSubmit={handleSemanticSearch} className="space-y-4 my-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập ý tưởng (ví dụ: 'kệ gỗ màu ấm có khe để ipad')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3ECF8E] placeholder:text-neutral-500 font-sans"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3ECF8E] hover:text-white transition-colors"
            >
              {searchLoading ? (
                <span className="size-4 rounded-full border-2 border-[#3ECF8E] border-t-transparent animate-spin inline-block" />
              ) : (
                <Sparkles className="size-4 animate-pulse" />
              )}
            </button>
          </div>
        </form>

        {/* Hiển thị danh mục sản phẩm tìm kiếm AI */}
        <div className="grid grid-cols-2 gap-4">
          {searchResult.slice(0, 2).map((prod) => (
            <Link
              key={prod.id}
              href={`/${prod.slug}`}
              className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#3ECF8E] transition-all"
            >
              <div className="relative size-10 rounded-lg overflow-hidden bg-white/10 shrink-0">
                <Image
                  src={
                    prod.images?.[0] ||
                    "https://placehold.co/100x100?text=No+Image"
                  }
                  alt={prod.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {prod.name}
                </p>
                <p className="text-[10px] text-[#3ECF8E] font-mono mt-0.5">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(prod.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* THẺ 2 (Chiếm 1 cột trên Desktop): GỬI GÓP Ý & Ý TƯỞNG THIẾT KẾ RIÊNG */}
      <div className="col-span-1 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between min-h-[20rem] relative z-10">
        <div className="flex justify-between items-start">
          <span className="text-xs font-mono text-[#3ECF8E] font-bold">
            02 / GÓP Ý &amp; Ý TƯỞNG
          </span>
          <FileText className="size-4 text-[#3ECF8E]" />
        </div>

        <AnimatePresence mode="wait">
          {!authSubmitted ? (
            <motion.form
              key="custom-form"
              onSubmit={handleIdeaSubmit}
              className="space-y-3 my-2"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                placeholder="Ý tưởng hoặc bản vẽ phác thảo cần in 3D của bạn..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                required
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3ECF8E] placeholder:text-neutral-500 font-sans resize-none"
              />
              <input
                type="email"
                placeholder="Hòm thư email liên hệ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#3ECF8E] placeholder:text-neutral-500 font-sans"
              />
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#3ECF8E] hover:bg-[#2eb87b] text-black font-mono uppercase text-[10px] font-bold tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {authLoading ? (
                  <span className="size-4 rounded-full border-2 border-black border-t-transparent animate-spin inline-block" />
                ) : (
                  "Gửi ý tưởng"
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="custom-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="my-4 text-left py-4"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <p className="text-sm text-white font-serif leading-relaxed italic">
                &quot;Cám ơn ý tưởng thiết kế tuyệt vời của bạn! Đội ngũ thiết
                kế của Boospace sẽ chủ động liên hệ qua Email để tư vấn thực thi
                bản vẽ sớm nhất.&quot;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-2">
          Dịch vụ in 3D theo yêu cầu
        </span>
      </div>
    </div>
  );
}
