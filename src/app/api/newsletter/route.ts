import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập địa chỉ Email hợp lệ." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();

    // Ghi nhận email vào bảng newsletter_subscriptions
    const { error } = await supabase
      .from("newsletter_subscriptions")
      .insert([{ email: email.trim().toLowerCase() }]);

    if (error) {
      // Mã lỗi Postgres: 23505 tương đương trùng lặp bản ghi (Email đã đăng ký)
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message:
            "Email của bạn đã có trong danh sách bản tin từ trước rồi ✨",
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Chào mừng bạn gia nhập cộng đồng tập trung sâu của Boospace!",
    });
  } catch (error: any) {
    console.error("[NEWSLETTER_API_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
