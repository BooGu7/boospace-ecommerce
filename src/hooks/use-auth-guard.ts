"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/store/auth";

export function useAuthGuard() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const mounted = useHydrated();

  useEffect(() => {
    if (mounted && !isAuthenticated && window.location.pathname !== "/auth/login") {
      router.push("/auth/login");
    }
  }, [mounted, isAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    isLoading: !mounted,
    isReady: mounted && isAuthenticated,
  };
}
