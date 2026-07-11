"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ghi nhận chi tiết lỗi hệ thống vào console của máy chủ phục vụ kiểm lỗi
    console.error("GLOBAL_SYSTEM_ERROR:", error);
  }, [error]);

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased flex items-center justify-center relative select-none">
      {/* Lớp lưới ma trận hạt mịn mờ ảo phía sau */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#1E1C1A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="max-w-md w-full p-8 rounded-3xl border border-[#DCD6CC] bg-white text-center space-y-6 relative z-10 shadow-lg mx-4"
      >
        {/* Vòng tròn cảnh báo dẹt nhịp thở */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-500/10 p-5 border border-red-500/20 animate-pulse">
            <AlertOctagon className="h-10 w-10 text-red-500 stroke-[1.25]" />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">
            SYSTEM ERROR 500
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-black leading-tight">
            Hệ thống gặp trục trặc nhỏ
          </h1>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-[#786F66] font-sans">
          Xin lỗi bạn, có lỗi bất ngờ xảy ra trong quá trình xử lý dữ liệu của
          xưởng. Bạn có thể bấm nút thử lại dưới đây hoặc quay lại sau ít phút
          nhé ✨
        </p>

        {/* Phím bấm Thử lại dẹt lớn màu cam hổ phách */}
        <div className="pt-2">
          <Button
            onClick={reset}
            className="w-full bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <RotateCcw className="h-4 w-4 text-black" />
            Thử tải lại trang
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
