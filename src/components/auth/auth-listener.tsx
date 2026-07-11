"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";

export function AuthListener() {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          const googleMeta = session.user.user_metadata || {};
          const fullName = (
            googleMeta.full_name ||
            googleMeta.name ||
            ""
          ).trim();

          let googleFirstName = googleMeta.given_name || "";
          let googleLastName = googleMeta.family_name || "";
          const googleAvatar =
            googleMeta.avatar_url || googleMeta.picture || "";

          // QUÉT ĐA DIỆN SỐ ĐIỆN THOẠI TRÊN CLIENT SESSION [1.1]
          const googlePhone =
            session.user.phone ||
            googleMeta.phone ||
            googleMeta.phone_number ||
            googleMeta.mobile ||
            "";

          // Thuật toán tách chữ thông minh (Smart Name Splitter) ở phía Client
          if (!googleFirstName && !googleLastName && fullName) {
            const nameParts = fullName.split(/\s+/);
            if (nameParts.length === 1) {
              googleFirstName = nameParts[0];
              googleLastName = "Boospace";
            } else if (nameParts.length >= 2) {
              googleLastName = nameParts[0]; // Từ đầu tiên làm Họ
              googleFirstName = nameParts.slice(1).join(" "); // Các từ còn lại làm Tên
            }
          }

          // Kéo dữ liệu hồ sơ cá nhân thực tế từ bảng 'users' của Supabase
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
            addresses: dbUser?.data?.addresses || [],
          };

          setUser(storefrontUser as any);
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
