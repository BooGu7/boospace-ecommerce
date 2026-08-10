import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: Context) {
  const { id } = await context.params;

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: Request, context: Context) {
  const { id } = await context.params;

  const body = await req.json();

  const supabase = getSupabaseAdmin();

  const slug = body.title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const { data, error } = await supabase
    .from("posts")
    .update({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      featured_image: body.featured_image,
      status: body.status,
      slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_req: Request, context: Context) {
  const { id } = await context.params;

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
