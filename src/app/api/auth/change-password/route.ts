import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { userId, currentPassword, newPassword } = await req.json();

    if (!userId || !currentPassword || !newPassword) {
      return Response.json({ message: "Thiếu dữ liệu" }, { status: 400 });
    }

    // Đọc thông tin từ bảng 'users'
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return Response.json(
        { message: "Không tìm thấy tài khoản" },
        { status: 404 },
      );
    }

    const storedPassword = user.data?.password;
    const isValid = await bcrypt.compare(currentPassword, storedPassword);

    if (!isValid) {
      return Response.json(
        { message: "Mật khẩu hiện tại không đúng" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedData = {
      ...user.data,
      password: hashedPassword,
    };

    // Ghi đè mật khẩu mới vào bảng 'users'
    const { error: updateError } = await supabase
      .from("users")
      .update({
        data: updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      return Response.json({ message: updateError.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
