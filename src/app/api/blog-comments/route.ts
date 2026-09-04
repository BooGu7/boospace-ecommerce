import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ success: false, error: "Thiếu postId" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, comments: data || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { post_id, name, email, comment } = await req.json();

    if (!post_id || !name || !email || !comment) {
      return NextResponse.json({ success: false, error: "Vui lòng nhập đủ thông tin" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_comments")
      .insert([{ post_id, name, email, comment }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, comment: data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
