"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

interface ScrollytellingSectionProps {
  diyImage: string;
  techImage: string;
  heroImage: string;
  slide1Title?: string;
  slide1Desc?: string;
  slide2Title?: string;
  slide2Desc?: string;
  slide3Title?: string;
  slide3Desc?: string;
}

export function ScrollytellingSection({
  diyImage,
  techImage,
  heroImage,
  slide1Title,
  slide1Desc,
  slide2Title,
  slide2Desc,
  slide3Title,
  slide3Desc,
}: ScrollytellingSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#FCFAF2", "#1C1A18", "#111111"],
  );

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  const s1Title = slide1Title || "Sờ chạm thô mộc của thớ gỗ sồi sấy.";
  const s1Desc =
    slide1Desc ||
    "Gỗ tự nhiên sấy lò được mài nhám mịn bằng tay và phủ lớp dầu bảo dưỡng hữu cơ mộc mạc, kết nối tâm trí của bạn với tự nhiên ngay tại bàn phím số.";
  const s2Title = slide2Title || "Giải phóng không gian sáng tạo.";
  const s2Desc =
    slide2Desc ||
    "Rãnh âm giấu cáp thông minh dọn dẹp sạch sẽ đống dây lộn xộn trên bàn làm việc, tạo khoảng không tối giản tĩnh lặng tuyệt đối cho sự tập trung sâu.";
  const s3Title = slide3Title || "Thiết kế công thái học bảo vệ cơ thể.";
  const s3Desc =
    slide3Desc ||
    "Nâng màn hình lên độ cao 15 độ lý tưởng vừa tầm mắt, giúp điều chỉnh tư thế ngồi thẳng tự nhiên, giảm thiểu mệt mỏi lên vùng cổ và vai gáy.";

  return (
    <>
      <div className="block md:hidden space-y-16 px-4 py-16 bg-[#FCFAF2] text-[#1E1C1A]">
        <div className="space-y-6">
          <div className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">
            01 / ANALOG TOUCH
          </div>
          <h3 className="text-3xl font-bold font-serif leading-tight">
            {s1Title}
          </h3>
          <p className="text-sm text-[#5C564E] leading-relaxed">{s1Desc}</p>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E1DDD5]">
            <Image
              src={diyImage}
              alt="Tactile Wood"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">
            02 / ZERO DISTRACTION
          </div>
          <h3 className="text-3xl font-bold font-serif leading-tight">
            {s2Title}
          </h3>
          <p className="text-sm text-[#5C564E] leading-relaxed">{s2Desc}</p>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E1DDD5]">
            <Image
              src={techImage}
              alt="Clutter Free"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-xs font-mono text-[#786F66] uppercase tracking-widest font-bold">
            03 / ERGONOMIC SPEC
          </div>
          <h3 className="text-3xl font-bold font-serif leading-tight">
            {s3Title}
          </h3>
          <p className="text-sm text-[#5C564E] leading-relaxed">{s3Desc}</p>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E1DDD5]">
            <Image
              src={heroImage}
              alt="Bảo vệ sức khỏe"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        style={{ backgroundColor }}
        className="hidden md:block relative h-[300vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E1DDD5_1px,transparent_1px),linear-gradient(to_bottom,#E1DDD5_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          <motion.div
            style={{ x }}
            className="flex w-[300vw] h-full items-center"
          >
            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-12">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <div className="col-span-6 space-y-6 text-left">
                  <span className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">
                    01 / ANALOG TOUCH
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-black leading-tight">
                    {s1Title}
                  </h2>
                  <p className="text-sm text-[#5C564E] leading-relaxed max-w-md">
                    {s1Desc}
                  </p>
                </div>
                <div className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E1DDD5] bg-white shadow-2xl">
                  <Image
                    src={diyImage}
                    alt="Chạm thô mộc"
                    fill
                    className="object-cover mix-blend-multiply opacity-95"
                  />
                </div>
              </div>
            </div>

            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-12">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <div className="col-span-6 space-y-6 text-left text-white">
                  <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                    02 / TRÁNH XAO NHÃNG
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-[#FCFAF2] leading-tight">
                    {s2Title}
                  </h2>
                  <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                    {s2Desc}
                  </p>
                </div>
                <div className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
                  <Image
                    src={techImage}
                    alt="Tránh xao nhãng"
                    fill
                    className="object-cover opacity-90"
                  />
                </div>
              </div>
            </div>

            <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-12">
              <div className="mx-auto max-w-7xl w-full grid grid-cols-12 gap-16 items-center">
                <div className="col-span-6 space-y-6 text-left text-white">
                  <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                    03 / CÔNG THÁI HỌC
                  </span>
                  <h2 className="text-5xl font-bold font-serif text-white leading-tight">
                    {s3Title}
                  </h2>
                  <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                    {s3Desc}
                  </p>
                </div>
                <div className="col-span-6 relative aspect-square w-full rounded-3xl overflow-hidden border border-amber-500/10 bg-neutral-950 shadow-2xl">
                  <Image
                    src={heroImage}
                    alt="Công thái học"
                    fill
                    className="object-cover opacity-85"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
