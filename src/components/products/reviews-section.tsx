"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form input states
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Gọi API lấy dữ liệu reviews từ database Supabase
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error("Lỗi tải reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  // Submit gửi đánh giá mới
  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng điền họ tên của bạn.");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          customer_name: name,
          rating,
          comment,
        }),
      });

      const data = await response.json();
      if (data.success && data.review) {
        toast.success("Cảm ơn bạn đã đóng góp đánh giá thực tế ✨");
        setReviews((prev) => [data.review, ...prev]);
        setName("");
        setComment("");
        setRating(5);
      } else {
        toast.error(data.error || "Gửi đánh giá không thành công.");
      }
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className="mt-16 border-t border-[#E1DDD5] pt-12 max-w-4xl mx-auto px-4 pb-16">
      <div className="grid gap-12 lg:grid-cols-5">
        {/* FORM ĐĂNG REVIEW (BÊN TRÁI) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-black">
              Đánh giá từ bạn
            </h3>
            <p className="text-xs font-mono text-[#786F66] uppercase tracking-wider">
              Chia sẻ cảm xúc chân thực của bạn khi sử dụng sản phẩm.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider">
                Họ và tên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên"
                required
                className="w-full rounded-xl border border-[#E1DDD5] bg-white px-4 py-2 text-sm outline-none text-black font-sans"
              />
            </div>

            {/* Chấm sao tương tác */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider block">
                Độ hài lòng
              </label>
              <div className="flex items-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= rating
                          ? "fill-[#FF9D00] text-[#FF9D00]"
                          : "text-[#DCD6CC]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider">
                Viết nội dung bình luận
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Đánh giá chi tiết về chất liệu, cảm giác sờ chạm..."
                rows={4}
                className="w-full rounded-xl border border-[#E1DDD5] bg-white px-4 py-2 text-sm outline-none text-black font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs tracking-wider rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng...
                </>
              ) : (
                "Đăng đánh giá"
              )}
            </button>
          </form>
        </div>

        {/* HIỂN THỊ DANH SÁCH REVIEW DỰA TRÊN DATABASE SUPABASE (BÊN PHẢI) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E1DDD5] pb-4">
            <MessageSquare className="h-5 w-5 text-[#786F66]" />
            <span className="font-serif text-lg font-bold text-black">
              Phản hồi từ khách hàng ({reviews.length})
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#FF9D00]" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[#E1DDD5] bg-[#EAE5D9]/10">
              <p className="text-xs font-mono text-[#786F66]">
                Chưa có đánh giá thực tế nào cho thiết kế này ⚙️
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[460px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-white border border-[#E1DDD5]/80 space-y-2 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-black">
                      {rev.customer_name}
                    </span>
                    <span className="text-[10px] font-mono text-[#786F66]">
                      {new Date(rev.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex gap-0.5 text-[#FF9D00]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating ? "fill-[#FF9D00]" : "text-[#DCD6CC]"
                        }`}
                      />
                    ))}
                  </div>

                  {rev.comment && (
                    <p className="text-xs font-sans leading-relaxed text-[#786F66]">
                      {rev.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
