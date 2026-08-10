"use client";

import { motion, type Variants } from "framer-motion";

export interface StepItem {
  num: string;
  title: string;
  desc: string;
}

interface HowItWorksProps {
  steps?: StepItem[];
  title?: string;
  tagline?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    num: "01",
    title: "Chọn Gu & Tinh Chỉnh",
    desc: "Lựa chọn thiết kế nguyên bản từ BooSpace, tự do cá nhân hóa kích thước và màu sắc nhám mờ (được giới hạn chọn lọc dưới 4 tone màu tối giản).",
  },
  {
    num: "02",
    title: "Chế Tác Chính Xác",
    desc: "Hệ thống máy in Flashforge Creator 5 Pro vận hành liên tục từ 12-24 giờ để dệt nên cấu trúc hình học nguyên khối với độ chuẩn xác cao nhất.",
  },
  {
    num: "03",
    title: "Đóng Gói Thủ Công",
    desc: "Sản phẩm được xử lý nguội thủ công tỉ mỉ, làm sạch mọi chi tiết thừa và đóng gói gọn gàng trong hộp giấy Kraft thân thiện môi trường trước khi gửi qua GHN / J&T Express.",
  },
];

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 22 },
  },
};

export function HowItWorks({ steps, title, tagline }: HowItWorksProps) {
  // Lấy dữ liệu động từ Supabase props, nếu không có sẽ lấy bộ chữ mặc định
  const displaySteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS;
  const displayTitle = title || "Sản phẩm sinh ra khi có bạn";
  const displayTagline = tagline || "QUY TRÌNH CHẾ TÁC ON-DEMAND";

  return (
    <div className="w-[100vw] h-full shrink-0 flex flex-col justify-center bg-[#FCFAF2] px-24 font-sans select-none border-r border-[#E1DDD5]/50">
      <div className="max-w-6xl mx-auto w-full text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#786F66] font-bold">
            {displayTagline}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-black font-bold mt-2">
            {displayTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displaySteps.map((step, index) => (
            <motion.div
              key={step.num || index}
              variants={blockVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 bg-[#F7F4EB] border border-[#E1DDD5] rounded-3xl flex flex-col justify-between group hover:shadow-md transition-all duration-300 min-h-[220px]"
            >
              <div>
                <span className="text-4xl font-serif text-amber-600/30 group-hover:text-amber-600 transition-colors duration-300 font-bold">
                  {step.num || `0${index + 1}`}
                </span>
                <h3 className="text-xl font-serif text-black font-bold mt-4 mb-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>

              <div className="w-full h-1 bg-[#E1DDD5] mt-6 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: index * 0.15 }}
                  className="h-full bg-amber-600"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
