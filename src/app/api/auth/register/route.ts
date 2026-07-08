import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // Kiểm tra email đã tồn tại chưa
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return Response.json(
        {
          message: "Email đã tồn tại",
        },
        {
          status: 400,
        },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = `user-${Date.now()}`;

    const userData = {
      id: userId,
      email,
      firstName,
      lastName,
      role: "customer",
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Tạo user
    const { error } = await supabase.from("users").insert({
      id: userId,
      email,
      sort_order: 0,
      data: userData,
    });

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
