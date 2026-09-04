"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Sun, Sunset } from "lucide-react";
import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

export type AmbientMode = "sunlight" | "sunset";

const MODES: {
  id: AmbientMode;
  label: string;
  sublabel: string;
  icon: typeof Sun;
}[] = [
  {
    id: "sunlight",
    label: "Nắng ấm",
    sublabel: "Ánh sáng tự nhiên",
    icon: Sun,
  },
  {
    id: "sunset",
    label: "Hoàng hôn",
    sublabel: "Hổ phách dịu mắt (Daylight)",
    icon: Sunset,
  },
];

export function CalmAmbientSwitcher() {
  const [mode, setMode] = useState<AmbientMode>("sunlight");
  const mounted = useHydrated();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("boo-ambient-mode") as AmbientMode | null;
      if (saved && ["sunlight", "sunset"].includes(saved)) {
        const timer = setTimeout(() => {
          setMode(saved);
          document.documentElement.setAttribute("data-ambient-mode", saved);
        }, 0);
        return () => clearTimeout(timer);
      } else {
        document.documentElement.setAttribute("data-ambient-mode", "sunlight");
        localStorage.setItem("boo-ambient-mode", "sunlight");
      }
    } catch {}
  }, []);

  const handleChangeMode = (newMode: AmbientMode) => {
    setMode(newMode);
    localStorage.setItem("boo-ambient-mode", newMode);
    document.documentElement.setAttribute("data-ambient-mode", newMode);
  };

  if (!mounted) return null;

  return (
    <aside
      role="region"
      aria-label="Bộ chuyển đổi ánh sáng tĩnh lặng (Daylight Ambient Mode)"
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 flex items-center select-none"
    >
      <div
        role="radiogroup"
        aria-label="Lựa chọn chế độ ánh sáng"
        className="relative flex items-center bg-[#FCFAF2]/95 backdrop-blur-md border border-[#E1DDD5] rounded-full p-1 shadow-lg shadow-black/5"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;

          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`${m.label}: ${m.sublabel}`}
              onClick={() => handleChangeMode(m.id)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-mono transition-colors duration-200 flex items-center gap-1.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF9D00] ${
                isActive
                  ? "text-black font-bold"
                  : "text-[#786F66] hover:text-black"
              }`}
              title={`${m.label} — ${m.sublabel}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeAmbientPill"
                  className="absolute inset-0 bg-white/95 rounded-full shadow-xs border border-[#E1DDD5]/60"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <Icon
                  className={`size-3.5 ${
                    isActive
                      ? m.id === "sunset"
                        ? "text-amber-600"
                        : "text-amber-500"
                      : "text-[#786F66]"
                  }`}
                />
                <span className="hidden sm:inline text-[11px]">{m.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* TOOLTIP GIẢI THÍCH TRIẾT LÝ DAYLIGHT */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            id="calm-ambient-tooltip"
            role="tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-12 left-0 w-64 p-3 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/10 text-left pointer-events-none"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="size-3" /> Calm Ambient Mode
            </div>
            <p className="text-[11px] font-sans text-neutral-200 leading-relaxed">
              Lấy cảm hứng từ <em>Daylight Computer</em>: Điều chỉnh tông màu ấm
              để loại bỏ ánh sáng xanh, bảo vệ mắt và nuôi dưỡng sự tĩnh lặng.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
