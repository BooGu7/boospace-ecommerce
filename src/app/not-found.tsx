"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center bg-[#FCFAF2] text-[#1E1C1A] overflow-hidden select-none">
      {/* Lớp lưới ma trận hạt mịn mờ ảo phía sau */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#1E1C1A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="space-y-6 relative z-10 max-w-lg"
      >
        {/* Chỉ số lỗi 404 dạng dẹt */}
        <p className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
          Error 404 • Page Not Found
        </p>

        {/* Tiêu đề Serif sang trọng */}
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-black tracking-tight leading-tight">
          Ối… không tìm thấy trang rồi
        </h1>

        {/* Mô tả Việt hóa mộc mạc */}
        <p className="text-sm text-[#786F66] leading-relaxed font-sans max-w-md mx-auto">
          Trang bạn đang tìm kiếm có vẻ đã “đi lạc” hoặc đã được chuyển dịch
          khỏi xưởng chế tác của Boo Space. Bạn thử quay lại trang chủ hoặc tiếp
          tục khám phá những sản phẩm độc bản khác nhé ✨
        </p>

        {/* Nút điều hướng dẹt bo tròn dứt khoát */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-black hover:bg-[#33302C] text-white rounded-xl font-mono uppercase text-[10px] font-bold tracking-wider py-4 px-6 cursor-pointer"
          >
            <Link href="/">Quay về trang chủ</Link>
          </Button>

          <Button
            variant="outline"
            asChild
            size="lg"
            className="rounded-xl border-[#E1DDD5] bg-white hover:bg-[#EAE5D9]/30 text-black font-mono uppercase text-[10px] font-bold tracking-wider py-4 px-6 cursor-pointer"
          >
            <Link href="/shop">Xem tiếp sản phẩm</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
