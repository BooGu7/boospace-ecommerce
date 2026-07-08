"use server";

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function forgotPassword(email: string) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (!user) {
    return {};
  }

  const token = crypto.randomBytes(32).toString("hex");

  const updatedData = {
    ...user.data,
    resetToken: token,
    resetTokenExpiresAt: Date.now() + 1000 * 60 * 30,
  };

  await supabase
    .from("users")
    .update({
      data: updatedData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  return {
    resetUrl: `/auth/reset-password?token=${token}`,
  };
}
