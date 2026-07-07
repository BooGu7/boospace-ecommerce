"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("announcement-dismissed");
    if (stored === "true") setDismissed(true);
  }, []);

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem("announcement-dismissed", "true");
  }

  if (!mounted || !siteConfig.announcement) return null;

  // Lấy câu chữ thông báo động từ cấu hình siteConfig
  const text = siteConfig.announcement;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="relative bg-foreground py-2.5 text-center text-xs text-background overflow-hidden border-b border-black/10 select-none flex items-center"
        >
          {/* ==========================================
             MA TRẬN CHỮ CHẠY VÔ CỰC SONG SONG (MARQUEE)
             ========================================== */}
          <div className="flex overflow-hidden whitespace-nowrap w-full pr-12">
            {/* Luồng chạy số 1 */}
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                ease: "linear",
                duration: 25, // Tăng/giảm số này để chỉnh tốc độ chạy (giây)
                repeat: Infinity,
              }}
              className="flex shrink-0 items-center justify-around min-w-full gap-16 pr-16"
            >
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {text} •
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {text} •
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {text} •
              </span>
            </motion.div>

            {/* Luồng chạy số 2 (Đảm bảo lặp liền mạch, không có khoảng trắng) */}
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity,
              }}
              className="flex shrink-0 items-center justify-around min-w-full gap-16 pr-16"
              aria-hidden="true"
            >
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {text} •
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {text} •
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {text} •
              </span>
            </motion.div>
          </div>

          {/* NÚT TẮT DẸT ĐÈ LÊN LỚP NỀN */}
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-md p-1.5 bg-foreground text-background/60 hover:text-background hover:bg-background/10 transition-all cursor-pointer focus:outline-none"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
