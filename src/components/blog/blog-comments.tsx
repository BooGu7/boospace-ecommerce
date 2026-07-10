"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  name: string;
  comment: string;
  created_at: string;
}

export function BlogComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`/api/blog-comments?postId=${postId}`);
        const data = await response.json();
        if (data.success) {
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !comment.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/blog-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, name, email, comment }),
      });
      const data = await response.json();
      if (data.success && data.comment) {
        toast.success("Bình luận của bạn đã được đăng tải ✨");
        setComments((prev) => [data.comment, ...prev]);
        setComment("");
        setName("");
        setEmail("");
      } else {
        toast.error(data.error || "Gửi thất bại.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-t border-[#E1DDD5] pt-12 mt-16 max-w-4xl mx-auto px-4">
      <div className="grid gap-12 md:grid-cols-5 text-left">
        {/* FORM BÌNH LUẬN (BÊN TRÁI) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-serif text-xl font-bold text-black">
            Để lại bình luận
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E1DDD5] bg-white px-4 py-2.5 text-xs outline-none text-black"
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E1DDD5] bg-white px-4 py-2.5 text-xs outline-none text-black"
            />
            <textarea
              placeholder="Viết cảm nhận của bạn tại đây..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-[#E1DDD5] bg-white px-4 py-2.5 text-xs outline-none text-black resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black hover:bg-[#33302C] text-white font-mono uppercase text-[10px] font-bold tracking-widest rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Gửi bình luận"
              )}
            </button>
          </form>
        </div>

        {/* FEED BÌNH LUẬN (BÊN PHẢI) */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E1DDD5]/60 pb-3">
            <MessageSquare className="h-4.5 w-4.5 text-[#786F66]" />
            <span className="font-serif text-base font-bold text-black">
              Bình luận từ độc giả ({comments.length})
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-[#FF9D00]" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs font-mono text-[#786F66] py-12 text-center uppercase">
              Chưa có bình luận nào cho bài viết này.
            </p>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              <AnimatePresence>
                {comments.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white border border-[#E1DDD5]/80 space-y-2"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#786F66]">
                      <span className="font-serif text-xs font-bold text-black">
                        {c.name}
                      </span>
                      <span>
                        {new Date(c.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C564E] leading-relaxed bg-[#FAF5F2]/40 p-3 rounded-lg border border-[#E1DDD5]/30">
                      {c.comment}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
