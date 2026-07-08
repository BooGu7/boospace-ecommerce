"use server";

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function forgotPassword(email: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Thay đổi sang truy vấn bảng 'users'
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    // Không tiết lộ email tồn tại hay không (Bảo mật thông tin)
    if (!user) {
      return {
        success: true,
      };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();

    const updatedData = {
      ...(user.data ?? {}),
      resetToken: token,
      resetTokenExpiresAt: expiresAt,
    };

    // Cập nhật token vào bảng 'users'
    const { error: updateError } = await supabase
      .from("users")
      .update({
        data: updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    console.log("RESET URL CHUẨN:", resetUrl);

    // Kích hoạt gửi thư khôi phục
    const { data, error: emailError } = await resend.emails.send({
      from: "Boo Space <support@boospace.tech>",
      to: normalizedEmail,
      subject: "Đặt lại mật khẩu tài khoản Boo Space",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;line-height:1.6">
          <h2 style="margin-bottom:24px;">Boo Space</h2>
          <p>Xin chào,</p>
          <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.</p>
          <p>Để tạo mật khẩu mới, vui lòng nhấn vào nút bên dưới:</p>
          <p>
            <a
              href="${resetUrl}"
              style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;"
            >
              Đặt lại mật khẩu
            </a>
          </p>
          <p>Nếu nút trên không hoạt động, bạn có thể sao chép và mở liên kết sau trong trình duyệt:</p>
          <p style="word-break:break-all;color:#666;">${resetUrl}</p>
          <p>Liên kết này sẽ hết hạn sau <strong>1 giờ</strong>.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#666;">
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Mật khẩu hiện tại của bạn sẽ không bị thay đổi.
          </p>
          <p style="font-size:12px;color:#666;">Trân trọng,<br />Đội ngũ Boo Space</p>
        </div>
      `,
    });

    console.log("RESEND SUCCESS:", data);

    if (emailError) {
      throw new Error(
        typeof emailError === "object"
          ? JSON.stringify(emailError)
          : String(emailError),
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể gửi email",
    );
  }
}
