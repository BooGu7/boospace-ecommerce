import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Thiếu email hoặc mật khẩu" },
        { status: 400 },
      );
    }

    const { data: user, error } = await supabase
      .from("ecommerce_users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    if (!user) {
      return Response.json(
        { message: "Email hoặc mật khẩu không đúng" },
        { status: 401 },
      );
    }

    // ⚠️ lấy password từ JSONB data
    const storedPassword = user.data?.password;

    if (!storedPassword) {
      return Response.json(
        { message: "User chưa có mật khẩu" },
        { status: 400 },
      );
    }

    const isValid = await bcrypt.compare(password, storedPassword);

    if (!isValid) {
      return Response.json(
        { message: "Email hoặc mật khẩu không đúng" },
        { status: 401 },
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.data?.firstName,
        lastName: user.data?.lastName,
      },
    });
  } catch (err) {
    return Response.json(
      {
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 },
    );
  }
}
