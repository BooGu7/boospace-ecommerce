import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, excerpt, content, featured_image } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Hãy nhập tiêu đề để tiếp tục ✨" },
        { status: 400 },
      );
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        excerpt,
        content,
        featured_image,
        slug,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Chưa tạo được, vui lòng thử lại ✨",
      },
      {
        status: 500,
      },
    );
  }
}
