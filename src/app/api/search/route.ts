import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// 1. Sinh vector embedding từ Google AI Studio (Gemini API)
async function getGeminiEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            parts: [{ text }],
          },
        }),
      },
    );

    if (!response.ok) {
      const errorDetail = await response.text();
      console.warn(
        `[GEMINI_EMBEDDING_FAILED] HTTP ${response.status}: ${errorDetail}`,
      );
      return null;
    }

    const json = await response.json();
    return json.embedding?.values || null;
  } catch (err) {
    console.error("[GEMINI_API_ERROR]", err);
    return null;
  }
}

// 2. Sinh vector embedding từ Ollama chạy Local
async function getOllamaEmbedding(text: string): Promise<number[] | null> {
  const ollamaUrl = process.env.OLLAMA_HOST || "http://localhost:11434";
  try {
    const response = await fetch(`${ollamaUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: text,
      }),
    });

    if (!response.ok) {
      console.warn("[OLLAMA_EMBEDDING_FAILED] HTTP", response.status);
      return null;
    }

    const json = await response.json();
    return json.embedding || null;
  } catch (err) {
    console.error("[OLLAMA_API_ERROR]", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || query.trim() === "") {
      return NextResponse.json({ products: [] });
    }

    const supabase = createSupabaseServerClient();
    let embedding: number[] | null = null;
    let searchMethod = "none";

    // BƯỚC 1: Thử sử dụng Google AI Studio (Gemini) làm dịch vụ chính
    if (process.env.GEMINI_API_KEY) {
      console.log("[SEARCH_API] Đang kết nối tới Google AI Studio...");
      embedding = await getGeminiEmbedding(query);
      if (embedding) {
        searchMethod = "semantic_ai_gemini";
      }
    }

    // BƯỚC 2: TỰ ĐỘNG CHUYỂN SANG OLLAMA nếu Gemini thất bại hoặc thiếu API Key
    if (!embedding) {
      console.log(
        "[SEARCH_API] Gemini không khả dụng. Đang tự động chuyển sang Ollama Local...",
      );
      embedding = await getOllamaEmbedding(query);
      if (embedding) {
        searchMethod = "semantic_ai_ollama";
      }
    }

    // BƯỚC 3: Nếu lấy được Vector hợp lệ (768 chiều) -> Chạy đối chiếu Vector trên Supabase
    if (embedding && embedding.length === 768) {
      console.log(
        `[SEARCH_API] Chạy tìm kiếm Vector thành công bằng phương thức: ${searchMethod}`,
      );
      const { data: vectorProducts, error: vectorError } = await supabase.rpc(
        "match_products",
        {
          query_embedding: embedding,
          match_threshold: 0.35, // Độ tương đồng tối thiểu 35%
          match_count: 6, // Trả về tối đa 6 kết quả
        },
      );

      if (!vectorError && vectorProducts && vectorProducts.length > 0) {
        return NextResponse.json({
          products: vectorProducts,
          success: true,
          method: searchMethod,
        });
      }
      if (vectorError) {
        console.warn(
          "[FALLBACK_TO_ILIKE_SEARCH_DUE_TO_RPC_ERROR]",
          vectorError.message,
        );
      }
    }

    // BƯỚC 4: FALLBACK CUỐI CÙNG: Tìm kiếm văn bản thường (ILIKE) nếu cả hai AI đều thất bại
    console.log(
      "[SEARCH_API] Không có vector hợp lệ từ cả hai AI. Chuyển sang tìm kiếm văn bản thường...",
    );
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, slug, price, images")
      .ilike("name", `%${query}%`)
      .limit(6);

    if (error) throw error;

    return NextResponse.json({
      products: products || [],
      success: true,
      method: "text_fallback",
    });
  } catch (error: any) {
    console.error("[SEMANTIC_SEARCH_API_ERROR]", error);
    return NextResponse.json(
      { products: [], success: false, error: error.message },
      { status: 500 },
    );
  }
}
