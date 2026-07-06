import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || query.trim() === "") {
      return NextResponse.json({ products: [] });
    }

    const supabase = createSupabaseServerClient();
    const mockVector = Array.from(
      { length: 1536 },
      () => Math.random() * 2 - 1,
    );

    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, slug, price, images")
      .ilike("name", `%${query}%`)
      .limit(4);

    if (error) throw error;

    return NextResponse.json({
      products: products || [],
      success: true,
    });
  } catch (error: any) {
    console.error("[SEMANTIC_SEARCH_API_ERROR]", error);
    return NextResponse.json(
      { products: [], success: false, error: error.message },
      { status: 500 },
    );
  }
}
