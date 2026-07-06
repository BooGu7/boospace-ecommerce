import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập đầy đủ các thông tin bắt buộc.",
        },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();

    // 1. Lưu bản ghi liên hệ vào table contact_messages của Supabase
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, subject, message }]);

    if (dbError) {
      throw dbError;
    }

    // 2. Chuyển tiếp email thông báo qua Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "boospace7@gmail.com";

    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Boospace Store <onboarding@resend.dev>",
          to: adminEmail,
          subject: `📬 [LIÊN HỆ MỚI] ${subject || "Từ khách hàng"}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1ddd5; border-radius: 16px; padding: 24px; background-color: #fbf9f4; color: #1c1c1c;">
              <h2 style="font-family: serif; border-bottom: 1px solid #e1ddd5; padding-bottom: 12px; color: #000; margin-top: 0;">Thông tin liên hệ mới</h2>
              <p><strong>Khách hàng:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Chủ đề:</strong> ${subject || "N/A"}</p>
              <hr style="border: 0; border-top: 1px solid #e1ddd5; margin: 20px 0;" />
              <p><strong>Nội dung:</strong></p>
              <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e1ddd5; line-height: 1.6;">
                ${message.replace(/\n/g, "<br/>")}
              </div>
            </div>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error(
          "[EMAIL_SEND_FAILED] Không thể chuyển tiếp email qua Resend",
        );
      }
    } else {
      console.warn(
        "[RESEND_KEY_MISSING] Thiếu RESEND_API_KEY trong .env.local. Hệ thống chỉ lưu database.",
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gửi tin nhắn thành công!",
    });
  } catch (error: any) {
    console.error("[CONTACT_API_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
