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

  const { data: existing } = await admin
    .from("ecommerce_users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    throw new Error("Email này đã được sử dụng");
  }

  const supabase = createSupabaseServerClient();

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

  const { error: profileError } = await admin.from("ecommerce_users").insert({
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
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    success: true,
  };
}
