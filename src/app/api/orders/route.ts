import { NextResponse } from "next/server";
import type { Order } from "@/types";
import { createSupabaseOrder } from "@/lib/repositories/supabase-repositories";

export async function POST(request: Request) {
  const order = (await request.json()) as Order;

  if (!order.id || !order.customerEmail || !order.items?.length) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  try {
    const created = await createSupabaseOrder(order);

    return NextResponse.json({ order: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi đặt hàng, bạn thử lại nhé ✨",
      },
      { status: 500 },
    );
  }
}
