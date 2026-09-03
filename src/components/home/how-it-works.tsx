"use client";

import { motion, type Variants } from "framer-motion";
import { Cpu, PackageCheck, Palette, Sparkles } from "lucide-react";

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

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 22 },
  },
};

const STEP_ICONS = [Palette, Cpu, PackageCheck];

export function HowItWorks({ steps = [], title, tagline }: HowItWorksProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-[100vw] h-full shrink-0 flex flex-col justify-center bg-[#FAF7F0] px-24 font-sans select-none border-r border-[#E1DDD5]/50 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 size-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full text-left relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 border-b pb-6 border-[#E1DDD5]"
        >
          {tagline && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#786F66] font-bold block mb-1">
              {tagline}
            </span>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-serif text-black font-bold">
              {title}
            </h2>
          )}
          <p className="text-xs text-[#5C564E] font-sans mt-1">
            Quy trình chế tác thủ công tinh gọn, từng sản phẩm được chăm chút tỉ mỉ cho riêng bạn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index] || Sparkles;
            return (
              <motion.div
                key={step.num || index}
                variants={blockVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-8 bg-white/80 backdrop-blur-md border border-[#E1DDD5] rounded-[36px] flex flex-col justify-between group hover:shadow-xl hover:border-amber-400 transition-all duration-300 min-h-[260px] shadow-sm relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-serif text-amber-600/30 group-hover:text-amber-600 transition-colors duration-300 font-bold">
                      {step.num || `0${index + 1}`}
                    </span>
                    <div className="size-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-serif text-black font-bold">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>

                <div className="w-full h-1.5 bg-[#E1DDD5]/60 mt-6 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.2, delay: index * 0.18 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
