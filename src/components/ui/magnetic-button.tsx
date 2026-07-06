"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Loader2 } from "lucide-react";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

const MotionButton = motion.button as any;

export function MagneticButton({
  children,
  loading = false,
  className = "",
  ...props
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const elasticX = useSpring(x, springConfig);
  const elasticY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionButton
      ref={ref}
      style={{ x: elasticX, y: elasticY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={loading || props.disabled}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-colors duration-200 select-none ${className}`}
      {...props}
    >
      <span
        className={`flex items-center justify-center gap-2 ${loading ? "opacity-0" : "opacity-100"}`}
      >
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-current" />
        </span>
      )}
    </MotionButton>
  );
}
