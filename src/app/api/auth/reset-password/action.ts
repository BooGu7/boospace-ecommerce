"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function resetPassword(
  token: string,
  password: string,
  confirmPassword: string,
) {
  if (password !== confirmPassword) {
    throw new Error("Mật khẩu xác nhận không khớp");
  }

  const { data: users } = await supabase.from("users").select("*");

  const user = users?.find(
    (u) =>
      u.data?.resetToken === token &&
      Number(u.data?.resetTokenExpiresAt) > Date.now(),
  );

  if (!user) {
    throw new Error("Link đặt lại mật khẩu không hợp lệ");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedData = {
    ...user.data,
    password: hashedPassword,
    resetToken: null,
    resetTokenExpiresAt: null,
  };

  const { error } = await supabase
    .from("users")
    .update({
      data: updatedData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
