"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  date: string;
  className: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Akshay Kothari",
    role: "Co-Founder @NotionHQ",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    quote:
      "“Đây là sản phẩm bàn làm việc duy nhất mà tôi cảm thấy hoàn toàn yên tâm và hào hứng khi chia sẻ không gian sáng tạo cùng con cái của mình!”",
    date: "9:02 PM • May 23, 2024",
    className: "lg:translate-x-12 lg:-translate-y-8 z-30",
  },
  {
    name: "Waqas Ali",
    role: "Founder @Atoms",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    quote:
      "“Boospace thực sự thấu hiểu điều đó. Một thiết kế tối giản mang sự mộc mạc và tĩnh lặng nguyên bản quay trở lại cuộc sống số bận rộn.”",
    date: "8:28 PM • May 23, 2024",
    className: "lg:translate-x-40 lg:translate-y-12 z-20",
  },
  {
    name: "Soleio",
    role: "Early Design @Meta @Dropbox",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    quote:
      "“Góc làm việc của tương lai. Nó không nhấn chìm bạn trong mớ dây cáp lộn xộn hay những thông báo đẩy dồn dập. Nhanh, mượt và thô mộc, tựa như một tác phẩm thủ công đích thực.”",
    date: "10:26 AM • May 22, 2024",
    className: "lg:-translate-x-16 lg:translate-y-20 z-10",
  },
];

// Cấu hình hoạt ảnh tuần tự (Sử dụng kiểu dữ liệu Variants để pass kiểm tra TypeScript)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 26,
      stiffness: 90,
    },
  },
  hover: {
    y: -12,
    scale: 1.025,
    rotate: 0.6,
    borderColor: "rgba(255, 157, 0, 0.4)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 0.08,
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

export function AsymmetricReviews() {
  return (
    <section className="relative z-10 py-32 bg-[#FCFAF2] overflow-hidden select-none border-t border-[#E1DDD5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative min-h-[600px] flex flex-col justify-center">
        {/* CHỮ NỀN CHẠY DƯỚI CARD - CO GIÃN THEO KHUNG NHÌN */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none text-center"
        >
          <h2 className="font-serif text-[12vw] sm:text-[14vw] font-bold text-[#EAE5D9] tracking-tighter leading-none select-none">
            What they are saying
          </h2>
        </motion.div>

        {/* LƯỚI CARD HOẠT ẢNH CHỒNG ĐÈ SO LE */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-full max-w-5xl mx-auto grid gap-8 lg:grid-cols-3 items-start"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover="hover"
              className={`w-full max-w-sm mx-auto rounded-3xl border border-[#E1DDD5] bg-[#35382B] text-white p-6 shadow-2xl cursor-grab active:cursor-grabbing ${t.className}`}
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-neutral-800">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white">
                    {t.name}
                  </h4>
                  <p className="text-[10px] font-mono text-white/60 tracking-wider uppercase">
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed italic mb-4">
                {t.quote}
              </p>

              {/* Date Footer */}
              <div className="border-t border-white/10 pt-3 text-[10px] font-mono text-white/40">
                {t.date}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
