"use client";

import * as React from "react";

interface MotionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function MotionWrapper({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: MotionWrapperProps) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const directionClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) will-change-[transform,opacity]
        ${isIntersecting ? "opacity-100 translate-x-0 translate-y-0 filter-none" : `opacity-0 ${directionClasses[direction]} blur-[2px]`}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
