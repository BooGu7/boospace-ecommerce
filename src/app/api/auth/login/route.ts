import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        {
          message: "Thiếu email hoặc mật khẩu",
        },
        {
          status: 400,
        },
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error("SUPABASE LOGIN ERROR:", error);

      return Response.json(
        {
          message: error.message,
          code: error.code,
        },
        {
          status: 400,
        },
      );
    }

    if (!data.user) {
      return Response.json(
        {
          message: "Không tìm thấy tài khoản",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName ?? "",
        lastName: data.user.user_metadata?.lastName ?? "",
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        message: err instanceof Error ? err.message : "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
