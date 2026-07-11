"use client";

import { useEffect, useState, useRef } from "react";
import {
  Star,
  Loader2,
  MessageSquare,
  Edit3,
  Image as ImageIcon,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase/client"; // Sử dụng client Supabase có sẵn trong dự án của bạn
import Image from "next/image";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  image_url?: string;
  created_at: string;
}

// Cấu hình Hoạt ảnh Spring mượt mà dẹt ngang
const listContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 20 },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { type: "spring", stiffness: 120, damping: 22 },
  },
};

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form input states
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // State quản lý hình ảnh đính kèm
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Xử lý khi người dùng chọn hình ảnh (Giới hạn nghiêm ngặt 2MB)
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Giới hạn 2MB (2 * 1024 * 1024 bytes)
    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast.error(
        "Dung lượng ảnh vượt quá giới hạn 2MB. Vui lòng chọn tệp nhỏ hơn.",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  // Loại bỏ hình ảnh đã chọn
  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Submit gửi đánh giá mới
  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng điền họ tên của bạn.");
      return;
    }

    setSubmitLoading(true);
    let uploadedImageUrl = "";

    try {
      // 1. Tiến hành tải ảnh lên Supabase Storage nếu có đính kèm
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        // Sinh tên file ngẫu nhiên tránh trùng lặp
        const fileName = `${productId}/${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("review-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Lấy liên kết đọc ảnh công khai từ Supabase
        const {
          data: { publicUrl },
        } = supabase.storage.from("review-images").getPublicUrl(fileName);

        uploadedImageUrl = publicUrl;
      }

      // 2. Gửi dữ liệu đánh giá và URL ảnh về API để lưu Database Supabase
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          customer_name: name,
          rating,
          comment,
          image_url: uploadedImageUrl,
        }),
      });

      const data = await response.json();
      if (data.success && data.review) {
        toast.success("Cảm ơn bạn đã đóng góp đánh giá thực tế ✨");
        setReviews((prev) => [data.review, ...prev]);
        setName("");
        setComment("");
        setRating(5);
        handleRemoveImage();
        setShowForm(false);
      } else {
        toast.error(data.error || "Gửi đánh giá không thành công.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Lỗi xảy ra trong quá trình truyền dữ liệu.");
    } finally {
      setSubmitLoading(false);
    }
  }

  // TÍNH TOÁN CHỈ SỐ ĐÁNH GIÁ ĐỘNG
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(
          1,
        )
      : "0.0";

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="mt-20 border-t border-[#E1DDD5]/80 bg-[#FCFAF2] py-16 selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* HEADER KHU VỰC ĐÁNH GIÁ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E1DDD5]/60 pb-8 mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono uppercase tracking-widest border border-[#DCD6CC] w-fit font-bold">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              Customer Feedback
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-black tracking-tight flex items-center gap-3">
              <MessageSquare className="h-7 w-7 text-[#786F66]" />
              Phản hồi thực tế
            </h2>
          </div>

          {!showForm && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-full border border-black bg-black px-6 py-3 text-xs font-mono font-bold tracking-wider text-white uppercase hover:bg-[#33302C] transition-colors cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Viết đánh giá
            </motion.button>
          )}
        </div>

        {/* 1. KHU VỰC CHỈ SỐ ĐỘNG */}
        {totalReviews > 0 && (
          <div className="grid md:grid-cols-12 gap-8 bg-[#FAF5F2]/60 p-8 rounded-3xl border border-[#E1DDD5] mb-12 items-center">
            <div className="md:col-span-4 text-center md:border-r border-[#E1DDD5]/60 md:pr-8 py-4">
              <span className="font-serif text-6xl font-light text-black leading-none">
                {averageRating}
              </span>
              <div className="flex justify-center gap-1 my-3 text-[#FF9D00]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Number(averageRating))
                        ? "fill-[#FF9D00]"
                        : "text-[#DCD6CC]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                Dựa trên {totalReviews} đánh giá thực tế
              </p>
            </div>

            <div className="md:col-span-8 space-y-2.5">
              {distribution.map((dist) => (
                <div
                  key={dist.stars}
                  className="flex items-center gap-4 text-xs font-mono text-[#786F66]"
                >
                  <span className="w-12 text-left">{dist.stars} Star</span>
                  <div className="flex-1 h-2 bg-[#EAE5D9]/40 rounded-full overflow-hidden border border-[#E1DDD5]/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dist.percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#FF9D00] rounded-full"
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-black">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-5 items-start">
          {/* ============================================================================
             2. CỘT TRÁI: FORM ĐĂNG REVIEW (BỔ SUNG ĐÍNH KÈM ẢNH)
             ============================================================================ */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="lg:col-span-2 bg-[#FAF5F2] border border-[#E1DDD5] rounded-3xl p-6 shadow-md space-y-6"
              >
                <div className="flex justify-between items-center border-b border-[#E1DDD5]/60 pb-3">
                  <h3 className="font-serif text-xl font-bold text-black">
                    Gửi nhận xét từ bạn
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      handleRemoveImage();
                    }}
                    className="text-xs font-mono text-[#786F66] hover:text-black cursor-pointer"
                  >
                    Đóng [✕]
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider block font-semibold">
                      Họ và tên người đánh giá
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập tên"
                      required
                      className="w-full rounded-xl border border-[#E1DDD5] bg-white px-4 py-2.5 text-xs outline-none text-black font-sans focus:border-[#FF9D00] transition-colors"
                    />
                  </div>

                  {/* Chấm sao tương tác */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider block font-semibold">
                      Mức độ hài lòng của bạn
                    </label>
                    <div className="flex items-center gap-1.5 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(null)}
                          onClick={() => setRating(star)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              star <= (hoveredStar ?? rating)
                                ? "fill-[#FF9D00] text-[#FF9D00]"
                                : "text-[#DCD6CC]"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider block font-semibold">
                      Chi tiết cảm nhận sờ chạm
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Đánh giá chi tiết về chất liệu, góc nghiêng hay độ hoàn thiện..."
                      rows={4}
                      className="w-full rounded-xl border border-[#E1DDD5] bg-white px-4 py-3 text-xs outline-none text-black font-sans resize-none focus:border-[#FF9D00] transition-colors"
                    />
                  </div>

                  {/* KHU VỰC TẢI ẢNH ĐÍNH KÈM GIỚI HẠN 2MB */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider block font-semibold">
                      Hình ảnh thực tế (Tối đa 2MB)
                    </label>

                    {!imagePreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center border border-dashed border-[#E1DDD5] rounded-2xl p-4 bg-white hover:bg-neutral-50 hover:border-[#FF9D00]/50 cursor-pointer transition-colors"
                      >
                        <ImageIcon className="h-5 w-5 text-[#786F66] mb-1" />
                        <span className="text-[10px] font-mono text-[#786F66] uppercase tracking-wider">
                          Đính kèm ảnh
                        </span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative border border-[#E1DDD5] rounded-2xl p-2 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-[#E1DDD5]">
                            <Image
                              src={imagePreview}
                              alt="Review preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-[#786F66] max-w-[120px] truncate">
                            {imageFile?.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs tracking-wider rounded-xl py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang truyền tải...
                      </>
                    ) : (
                      "Đăng đánh giá"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================================
             3. CỘT PHẢI: HIỂN THỊ DANH SÁCH REVIEW (ĐÃ KÈM KHUNG HIỂN THỊ ẢNH THỰC TẾ)
             ============================================================================ */}
          <div
            className={`${showForm ? "lg:col-span-3" : "lg:col-span-5"} space-y-6 w-full`}
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF9D00]" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 rounded-3xl border border-dashed border-[#E1DDD5] bg-[#EAE5D9]/15">
                <p className="text-xs font-mono text-[#786F66] tracking-wider uppercase font-semibold">
                  Chưa có nhận xét nào cho thiết kế này ⚙️
                </p>
                <p className="text-xs text-[#786F66]/60 mt-1 font-sans">
                  Hãy là người đầu tiên sờ chạm và chia sẻ trải nghiệm.
                </p>
              </div>
            ) : (
              <motion.div
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 max-h-[580px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#EAE5D9]"
              >
                <AnimatePresence>
                  {reviews.map((rev) => (
                    <motion.div
                      key={rev.id}
                      variants={cardVariants}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="p-6 rounded-2xl bg-white border border-[#E1DDD5]/70 space-y-3.5 shadow-sm transition-all hover:border-[#FF9D00]/25 relative"
                    >
                      {/* Name & Date */}
                      <div className="flex items-center justify-between border-b border-[#E1DDD5]/40 pb-2">
                        <span className="font-serif text-sm font-semibold text-black">
                          {rev.customer_name}
                        </span>
                        <span className="text-[9px] font-mono text-[#786F66] uppercase tracking-wider font-semibold">
                          {new Date(rev.created_at).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 text-[#FF9D00]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < rev.rating
                                ? "fill-[#FF9D00]"
                                : "text-[#DCD6CC]"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment text */}
                      {rev.comment && (
                        <p className="text-xs font-sans leading-relaxed text-[#786F66] bg-[#FAF5F2]/40 p-3 rounded-lg border border-[#E1DDD5]/30">
                          {rev.comment}
                        </p>
                      )}

                      {/* KHUNG HIỂN THỊ HÌNH ẢNH REVIEW THỰC TẾ (NẾU CÓ) */}
                      {rev.image_url && (
                        <div className="relative w-28 aspect-square rounded-xl overflow-hidden border border-[#E1DDD5] bg-[#EAE5D9]/20 hover:scale-102 hover:border-[#FF9D00]/40 transition-all cursor-zoom-in">
                          <Image
                            src={rev.image_url}
                            alt="Hình ảnh thực tế từ khách hàng"
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
