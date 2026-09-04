"use client";

import { motion } from "framer-motion";
import { Sun, Sunset } from "lucide-react";
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
    sublabel: "Hổ phách dịu mắt",
    icon: Sunset,
  },
];

export function CalmAmbientSwitcher() {
  const [mode, setMode] = useState<AmbientMode>("sunlight");
  const mounted = useHydrated();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("boo-ambient-mode") as AmbientMode | null;
      if (saved && ["sunlight", "sunset"].includes(saved)) {
        const timer = setTimeout(() => {
          setMode(saved);
          document.documentElement.setAttribute("data-ambient", saved);
          document.documentElement.setAttribute("data-ambient-mode", saved);
        }, 0);
        return () => clearTimeout(timer);
      } else {
        document.documentElement.setAttribute("data-ambient", "sunlight");
        document.documentElement.setAttribute("data-ambient-mode", "sunlight");
        localStorage.setItem("boo-ambient-mode", "sunlight");
      }
    } catch {}
  }, []);

  const handleChangeMode = (newMode: AmbientMode) => {
    setMode(newMode);
    localStorage.setItem("boo-ambient-mode", newMode);
    document.documentElement.setAttribute("data-ambient", newMode);
    document.documentElement.setAttribute("data-ambient-mode", newMode);
  };

  if (!mounted) return null;

  return (
    <aside
      role="region"
      aria-label="Bộ chuyển đổi ánh sáng tĩnh lặng (Calm Ambient Mode)"
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 flex items-center select-none"
    >
      <div
        role="radiogroup"
        aria-label="Lựa chọn chế độ ánh sáng"
        className="relative flex items-center bg-[#FCFAF2]/95 backdrop-blur-md border border-[#E1DDD5] rounded-full p-1 shadow-lg shadow-black/5"
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
    </aside>
  );
}
