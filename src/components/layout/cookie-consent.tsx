"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";

// Cấu hình Hoạt ảnh Spring mượt mà dẹt dọc (Type-safe Variants)
const bannerVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 25 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export function CookieConsent() {
  const [showBanner, setShowConsent] = useState(false);

  // Chỉ kiểm tra LocalStorage ở Client-side sau khi Mount thành công để tránh lỗi Hydration
  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent_status");
    if (!consent) {
      // Tự động mở bảng thông báo sau 3 giây khi vào trang
      const timer = setTimeout(() => setShowConsent(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Xử lý Chấp nhận
  const handleAccept = () => {
    localStorage.setItem("cookie_consent_status", "accepted");
    setShowConsent(false);
  };

  // Xử lý Từ chối
  const handleDecline = () => {
    localStorage.setItem("cookie_consent_status", "declined");
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-6 left-6 z-[95] w-full max-w-sm overflow-hidden rounded-3xl border border-[#E1DDD5] bg-[#FCFAF2] p-6 shadow-2xl text-left select-none"
        >
          {/* Nút đóng nhanh ở góc - ĐÃ BỔ SUNG ARIA-LABEL CHUẨN ACCESSIBILITY [1.1] */}
          <button
            onClick={handleDecline}
            aria-label="Đóng thông báo Cookie và từ chối"
            className="absolute right-4 top-4 rounded-md p-1 text-[#786F66] hover:bg-[#EAE5D9]/40 hover:text-black transition-colors cursor-pointer focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Tiêu đề Serif */}
          <div className="space-y-1.5 pr-8">
            <h3 className="font-serif text-base font-bold text-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#3ECF8E]" />
              Quyền riêng tư &amp; Cookie
            </h3>
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#786F66] font-semibold">
              Cookie Consent • Privacy Policy
            </p>
          </div>

          {/* Mô tả mộc mạc dễ chịu */}
          <p className="mt-3.5 text-[11px] sm:text-xs leading-relaxed text-[#5c544d] font-sans">
            Boo Space sử dụng cookie để ghi nhận giỏ hàng, duy trì danh sách yêu
            thích và mang lại trải nghiệm duyệt web tối giản, tĩnh lặng nhất của
            bạn hằng ngày.
          </p>

          {/* Hai phím bấm dẹt song song */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 rounded-xl bg-black hover:bg-[#33302C] text-[10px] font-mono font-bold tracking-widest text-white py-3 uppercase shadow-sm cursor-pointer transition-colors"
            >
              Xác nhận
            </button>
            <button
              onClick={handleDecline}
              className="rounded-xl border border-[#E1DDD5] bg-white hover:bg-neutral-50 text-[10px] font-mono font-bold tracking-widest text-black py-3 px-5 uppercase transition-colors cursor-pointer"
            >
              Từ chối
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
