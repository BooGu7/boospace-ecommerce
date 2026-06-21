"use server";

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function forgotPassword(email: string) {
  const { data: user, error } = await supabase
    .from("ecommerce_users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    return {
      success: true,
      resetUrl: null,
    };
  }

  const resetToken = randomUUID();

  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();

  const currentData = user.data ?? {};

  const { error: updateError } = await supabase
    .from("ecommerce_users")
    .update({
      data: {
        ...currentData,
        resetToken,
        resetTokenExpiresAt: expiresAt,
      },
    })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const resetUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}` +
    `/auth/reset-password?token=${resetToken}`;

  console.log("RESET LINK:", resetUrl);

  return {
    success: true,
    resetUrl,
  };
}
