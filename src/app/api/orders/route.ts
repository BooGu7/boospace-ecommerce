import { NextResponse } from "next/server"
import type { Order } from "@/types"
import { hasSupabaseConfig } from "@/lib/supabase/server"
import { createSupabaseOrder } from "@/lib/repositories/supabase-repositories"

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    )
  }

  const order = (await request.json()) as Order

  if (!order.id || !order.customerEmail || !order.items?.length) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 })
  }

  try {
    const created = await createSupabaseOrder(order)
    return NextResponse.json({ order: created }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order create failed" },
      { status: 500 }
    )
  }
}
