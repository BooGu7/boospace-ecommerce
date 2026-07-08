import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || query.trim() === "") {
      return NextResponse.json({ products: [], success: true });
    }

    const supabase = createSupabaseServerClient();

    // Thực hiện truy vấn nhanh gọn bằng lệnh SQL ILIKE trực tiếp trên Supabase
    // Đảm bảo chỉ hiển thị các sản phẩm đã kích hoạt xuất bản công khai (published = true)
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, slug, price, images")
      .eq("published", true)
      .ilike("name", `%${query.trim()}%`)
      .limit(6); // Giới hạn 6 kết quả phù hợp nhất

    if (error) throw error;

    return NextResponse.json({
      products: products || [],
      success: true,
      method: "text_search_sql", // Phương thức tìm kiếm SQL thuần tốc độ cao
    });
  } catch (error: any) {
    console.error("[SEARCH_API_ERROR]", error);
    return NextResponse.json(
      { products: [], success: false, error: error.message },
      { status: 500 },
    );
  }
}
