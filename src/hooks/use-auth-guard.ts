"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export function useAuthGuard() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (
      mounted &&
      !isAuthenticated &&
      window.location.pathname !== "/auth/login"
    ) {
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
