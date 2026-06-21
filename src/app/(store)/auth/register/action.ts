"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { registerSchema } from "@/lib/validators";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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

  const { data: existing, error: checkError } = await supabase
    .from("ecommerce_users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (existing) {
    throw new Error("Email này đã được sử dụng");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const id = `user-${Date.now()}`;

  const { error } = await supabase.from("ecommerce_users").insert({
    id,
    email: normalizedEmail,
    sort_order: 0,
    data: {
      id,
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    userId: id,
  };
}
