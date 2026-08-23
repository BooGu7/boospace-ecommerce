import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPayOSWebhookData } from "@/lib/payos";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. TỰ ĐỘNG PHẢN HỒI KHI PAYOS DASHBOARD BẤM "LƯU" KIỂM TRA WEBHOOK
    if (
      body.desc === "confirm-webhook" ||
      body.data?.description?.includes("test") ||
      !body.data
    ) {
      return NextResponse.json({
        success: true,
        message: "Webhook URL is active and verified by BooSpace",
      });
    }

    // 2. XÁC THỰC CHỮ KÝ SỐ SHA-256
    const verifiedData = verifyPayOSWebhookData(body);

    if (!verifiedData) {
      return NextResponse.json(
        { success: false, message: "Invalid Webhook Signature" },
        { status: 400 },
      );
    }

    const { orderCode, amount, reference, transactionDateTime, description } =
      verifiedData;
    const referenceNumber = String(
      reference || `PAYOS-${orderCode}-${Date.now()}`,
    );

    // 3. CHỐNG XỬ LÝ TRÙNG LẶP (IDEMPOTENCY)
    const { data: existingTx } = await supabaseAdmin
      .from("transactions")
      .select("id")
      .eq("reference_number", referenceNumber)
      .maybeSingle();

    if (existingTx) {
      return NextResponse.json({
        success: true,
        message: "Giao dịch đã được xử lý trước đó",
      });
    }

    // 4. TÌM KIẾM ĐƠN HÀNG TRÊN SUPABASE
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("id, code, total, payment_status, order_status")
      .or(`code.ilike.%${orderCode}%,notes.ilike.%${orderCode}%`)
      .limit(1);

    const order = orders?.[0];

    // 5. LƯU GIAO DỊCH VÀO BẢNG TRANSACTIONS
    await supabaseAdmin.from("transactions").insert({
      order_id: order?.id || null,
      order_code: order?.code || String(orderCode),
      gateway_code: "PAYOS",
      reference_number: referenceNumber,
      amount: Number(amount || 0),
      currency: "VND",
      status: "Paid",
      payment_method: "VietQR_PayOS",
      memo: description || `PayOS Order ${orderCode}`,
      raw_payload: verifiedData,
      paid_at: transactionDateTime || new Date().toISOString(),
    });

    // 6. GẠCH NỢ ĐƠN HÀNG SANG 'Paid' & 'confirmed'
    if (order) {
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "Paid",
          order_status:
            order.order_status === "pending" ? "confirmed" : order.order_status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      console.log(
        `✅ [PAYOS_SUCCESS] Đã gạch nợ thành công đơn #${order.code} (${amount} ₫)`,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gạch nợ đơn hàng PayOS thành công",
      orderCode,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý webhook";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
