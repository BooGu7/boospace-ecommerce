import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// 1. LẤY TOÀN BỘ ĐÁNH GIÁ CỦA SẢN PHẨM
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Thiếu tham số productId" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, reviews: reviews || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// 2. ĐĂNG ĐÁNH GIÁ MỚI (ĐÃ BỔ SUNG CỘT IMAGE_URL)
export async function POST(req: Request) {
  try {
    const { product_id, customer_name, rating, comment, image_url } =
      await req.json();

    if (!product_id || !customer_name || !rating) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập tên và chấm điểm số sao." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          product_id,
          customer_name,
          rating,
          comment,
          image_url, // Ghi nhận link ảnh từ Supabase Storage
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
