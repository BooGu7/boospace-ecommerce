"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { registerSchema } from "@/lib/validators";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export async function registerUser(data: RegisterInput) {
  const validation = registerSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const { firstName, lastName, email, password } = validation.data;
  const normalizedEmail = email.trim().toLowerCase();
  const admin = getSupabaseAdmin();

  // Kiểm tra xem email này đã tồn tại trong bảng 'users' hay chưa
  const { data: existing } = await admin
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    throw new Error("Email này đã được sử dụng");
  }

  const supabase = createSupabaseServerClient();

  // Đăng ký tài khoản trên Supabase Auth và tự động kích hoạt gửi Email verify
  const { data: authData, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      data: {
        firstName,
        lastName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = authData.user;
  if (!user) {
    throw new Error("Không thể tạo tài khoản");
  }

  // SỬA LỖI TRÙNG KHÓA: Sử dụng .upsert() thay vì .insert() để ghi đè an toàn nếu tài khoản đăng ký lại
  const { error: profileError } = await admin.from("users").upsert(
    {
      id: user.id,
      email: normalizedEmail,
      sort_order: 0,
      data: {
        id: user.id,
        firstName,
        lastName,
        email: normalizedEmail,
        isVerified: false,
        createdAt: new Date().toISOString(),
      },
    },
    { onConflict: "id" },
  );

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    success: true,
  };
}
