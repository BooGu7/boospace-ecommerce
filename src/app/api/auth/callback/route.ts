import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    );

    // ĐỔI MÃ CODE THÀNH PHIÊN ĐĂNG NHẬP BẢO MẬT (KHÔNG ĐỂ LẠI TOKEN TRÊN URL)
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Chuyển hướng sạch sẽ về trang chủ hoặc trang trước đó
  return NextResponse.redirect(`${origin}${next}`);
}
