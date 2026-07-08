"use server";

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function resetPassword(
  token: string,
  password: string,
  confirmPassword: string,
) {
  if (!token) {
    throw new Error("Token không hợp lệ");
  }
  if (!password) {
    throw new Error("Vui lòng nhập mật khẩu mới");
  }
  if (password !== confirmPassword) {
    throw new Error("Mật khẩu xác nhận không khớp");
  }

  // Truy vấn từ bảng 'users'
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .contains("data", {
      resetToken: token,
    })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!user) {
    throw new Error("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
  }

  const userData = user.data;
  if (
    !userData?.resetTokenExpiresAt ||
    new Date(userData.resetTokenExpiresAt).getTime() < Date.now()
  ) {
    throw new Error("Token đã hết hạn");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Cập nhật cấu trúc mật khẩu băm mới lên bảng 'users'
  const { error: updateError } = await supabase
    .from("users")
    .update({
      data: {
        ...userData,
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return {
    success: true,
  };
}
