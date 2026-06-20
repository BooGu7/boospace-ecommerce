import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Bạn chưa chọn tệp nào cả ✨" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const filename = `uploads/${Date.now()}-${file.name}`;

    const buffer = new Uint8Array(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("media")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("media").getPublicUrl(filename);

    return NextResponse.json({
      url: data.publicUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải lên, bạn thử lại nhé ✨",
      },
      { status: 500 },
    );
  }
}
