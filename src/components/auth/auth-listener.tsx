"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import type { Address, User, UserRole } from "@/types";

export function AuthListener() {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // 🧹 TỰ ĐỘNG LÀM SẠCH THANH URL NẾU CÓ ĐUÔI #access_token
    if (
      typeof window !== "undefined" &&
      window.location.hash.includes("access_token")
    ) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (
          typeof window !== "undefined" &&
          window.location.hash.includes("access_token")
        ) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }

        if (session?.user) {
          const googleMeta = session.user.user_metadata || {};
          const fullName = String(
            googleMeta.full_name || googleMeta.name || "",
          ).trim();

          let googleFirstName = String(googleMeta.given_name || "");
          let googleLastName = String(googleMeta.family_name || "");
          const googleAvatar = String(
            googleMeta.avatar_url || googleMeta.picture || "",
          );

          const googlePhone = String(
            session.user.phone ||
              googleMeta.phone ||
              googleMeta.phone_number ||
              googleMeta.mobile ||
              "",
          );

          if (!googleFirstName && !googleLastName && fullName) {
            const nameParts = fullName.split(/\s+/);
            if (nameParts.length === 1) {
              googleFirstName = nameParts[0];
              googleLastName = "Boospace";
            } else if (nameParts.length >= 2) {
              googleLastName = nameParts[0];
              googleFirstName = nameParts.slice(1).join(" ");
            }
          }

          const { data: dbUser } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          const storefrontUser = {
            id: session.user.id,
            email: session.user.email || dbUser?.email || "",
            firstName:
              dbUser?.data?.firstName || googleFirstName || "Khách hàng",
            lastName: dbUser?.data?.lastName || googleLastName || "Boospace",
            phone: dbUser?.data?.phone || googlePhone || "",
            avatar: googleAvatar || dbUser?.data?.avatar || "",
            addresses: (dbUser?.data?.addresses || []) as Address[],
            role: (dbUser?.data?.role || "customer") as UserRole,
            createdAt: dbUser?.created_at || new Date().toISOString(),
            updatedAt: dbUser?.updated_at || new Date().toISOString(),
          };

          // 🌟 ĐÃ SỬA: ÉP KIỂU CHUẨN USER, TRIỆT TIÊU HOÀN TOÀN 'any'
          setUser(storefrontUser as unknown as User);
        }
      } else if (event === "SIGNED_OUT") {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, logout]);

  return null;
}
