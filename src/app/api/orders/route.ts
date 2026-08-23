import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { createPayOSPaymentLink } from "@/lib/payos";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface DbProductItem {
  id: string;
  name: string;
  price: number | string | null;
  published: boolean | null;
}

interface RequestOrderItem {
  productId?: string;
  product_id?: string;
  quantity?: number;
}

interface CouponRecord {
  id: string;
  code: string;
  discount_percent: number;
  active: boolean;
}

/**
 * 1. KIỂM TRA TRẠNG THÁI THANH TOÁN (GET)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryCode =
      searchParams.get("order_id") ||
      searchParams.get("code") ||
      searchParams.get("id");

    if (!queryCode) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng." },
        { status: 400 },
      );
    }

    let supabaseAdmin: SupabaseClient;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch {
      supabaseAdmin = createSupabaseServerClient();
    }

    const cleanCode = queryCode.trim();
    const isUuid =
      cleanCode.length === 36 &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        cleanCode,
      );

    const strippedCode = cleanCode.replace(/^(ORD|BOO)-?/i, "");

    // ĐÃ SỬA: Bỏ ambiguous products(...) trong select để triệt tiêu lỗi HTTP 300
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .or(
        `code.eq.${cleanCode},code.eq.ORD-${strippedCode},code.eq.BOO-${strippedCode},code.eq.${strippedCode},shipping_address->>payos_order_code.eq.${cleanCode},id.eq.${isUuid ? cleanCode : "00000000-0000-0000-0000-000000000000"}`,
      )
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      order,
      isPaid: String(order.payment_status || "").toLowerCase() === "paid",
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * 2. TẠO ĐƠN HÀNG VÀ SINH LINK THANH TOÁN PAYOS (POST)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerEmail = (body.customerEmail || body.customer_email || "")
      .toString()
      .trim()
      .toLowerCase();
    const customerName = (body.customerName || body.customer_name || "")
      .toString()
      .trim();
    const customerPhone = (body.customerPhone || body.customer_phone || "")
      .toString()
      .trim();

    const rawCustomerId = body.customerId || body.customer_id;
    const isUuid =
      typeof rawCustomerId === "string" && rawCustomerId.length === 36;
    const customerId = isUuid ? rawCustomerId : null;

    const rawPaymentMethod = (
      body.paymentMethod ||
      body.payment_method ||
      "COD"
    )
      .toString()
      .trim();
    const isVietQR =
      rawPaymentMethod.toLowerCase().includes("vietqr") ||
      rawPaymentMethod.toLowerCase().includes("payos");
    const savedPaymentMethod = isVietQR ? "VietQR" : "COD";

    const shippingAddress = (body.shippingAddress ||
      body.shipping_address ||
      {}) as Record<string, any>;
    const userNotes = (body.notes || "").toString().trim();
    const couponCode = body.couponCode || body.coupon_code || "";
    const items = (body.items || []) as RequestOrderItem[];

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Giỏ hàng không có sản phẩm." },
        { status: 400 },
      );
    }

    if (!customerPhone || !customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu thông tin người nhận hoặc số điện thoại.",
        },
        { status: 400 },
      );
    }

    let supabaseAdmin: SupabaseClient;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch {
      supabaseAdmin = createSupabaseServerClient();
    }

    // LẤY GIÁ BÁN THỰC TẾ TỪ DATABASE
    const productIds = items
      .map((i: RequestOrderItem) => i.productId || i.product_id)
      .filter(Boolean);

    const { data: dbProducts, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, published")
      .in("id", productIds);

    if (productsError || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Sản phẩm không tồn tại hoặc đã ngừng bán." },
        { status: 400 },
      );
    }

    const productMap = new Map<string, DbProductItem>(
      (dbProducts as DbProductItem[]).map((p) => [p.id, p]),
    );

    let calculatedSubtotal = 0;
    const verifiedOrderItems = [];

    for (const item of items) {
      const pId = String(item.productId || item.product_id);
      const dbProd = productMap.get(pId);
      if (!dbProd || dbProd.published === false) {
        return NextResponse.json(
          { success: false, error: `Sản phẩm ID ${pId} không còn khả dụng.` },
          { status: 400 },
        );
      }

      const realUnitPrice = Number(dbProd.price ?? 0);
      const qty = Math.max(1, Number(item.quantity ?? 1));
      const lineTotal = realUnitPrice * qty;

      calculatedSubtotal += lineTotal;

      verifiedOrderItems.push({
        product_id: dbProd.id,
        quantity: qty,
        price: lineTotal,
        unit_price: realUnitPrice,
        total_price: lineTotal,
      });
    }

    // XÁC THỰC COUPON
    let discountPercent = 0;
    let appliedCouponId: string | null = null;

    if (couponCode && typeof couponCode === "string") {
      const { data: couponData } = await supabaseAdmin
        .from("coupons")
        .select("id, code, discount_percent, active")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("active", true)
        .maybeSingle();

      const coupon = couponData as CouponRecord | null;
      if (coupon) {
        discountPercent = coupon.discount_percent;
        appliedCouponId = coupon.id;
      }
    }

    const discountAmount = Math.round(
      calculatedSubtotal * (discountPercent / 100),
    );

    // PHÍ VẬN CHUYỂN
    const city = (shippingAddress?.city || "").toLowerCase();
    const isHCM =
      city.includes("hồ chí minh") ||
      city.includes("hcm") ||
      city.includes("sài gòn");

    let serverShippingFee = 0;
    if (
      isHCM ||
      calculatedSubtotal >= (siteConfig?.freeShippingThreshold || 500000)
    ) {
      serverShippingFee = 0;
    } else {
      serverShippingFee = Number(body.shipping || 30000);
    }

    const finalTotal = calculatedSubtotal - discountAmount + serverShippingFee;

    // SINH MÃ SỐ NGUYÊN CHO PAYOS (ẨN DƯỚI NỀN)
    const payosNumericCode = Math.abs(
      parseInt(Date.now().toString().slice(-6), 10) +
        Math.floor(Math.random() * 1000),
    );
    const orderCode =
      body.orderNumber ||
      body.code ||
      `ORD-${Date.now().toString(36).toUpperCase()}`;

    const formattedAddressStr =
      shippingAddress?.formattedAddress ||
      `${shippingAddress?.line1 || ""}, ${shippingAddress?.district || ""}, ${shippingAddress?.city || ""}`.replace(
        /^, |, $/g,
        "",
      );

    // LƯU MÃ PAYOS VÀO JSONB ẨN, TRẢ LẠI GHI CHÚ NGUYÊN BẢN CỦA KHÁCH
    const enhancedShippingAddress = {
      ...shippingAddress,
      payos_order_code: payosNumericCode,
    };

    const { data: createdOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        code: orderCode,
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail || `${customerPhone}@boospace.tech`,
        customer_phone: customerPhone,
        customer_address: formattedAddressStr || "Nhận tại xưởng BooSpace",
        shipping_address: enhancedShippingAddress,
        subtotal: calculatedSubtotal,
        shipping: serverShippingFee,
        total: finalTotal,
        order_status: "pending",
        payment_status: "Pending",
        payment_method: savedPaymentMethod,
        applied_coupon_id: appliedCouponId,
        shipping_carrier: "Giao hàng tiêu chuẩn",
        notes: userNotes || null, // CHỈ LƯU GHI CHÚ THẬT CỦA KHÁCH HÀNG
        packaging_note:
          "Hàng dễ vỡ. Bọc xốp nổ 3 lớp, đóng thùng carton sóng E, dán tem vỡ niêm phong xưởng",
      })
      .select("id, code, total")
      .single();

    if (orderError || !createdOrder) {
      return NextResponse.json(
        { success: false, error: `Không thể tạo đơn: ${orderError?.message}` },
        { status: 500 },
      );
    }

    const itemsToInsert = verifiedOrderItems.map((item) => ({
      order_id: createdOrder.id,
      ...item,
    }));

    await supabaseAdmin.from("order_items").insert(itemsToInsert);

    // NẾU LÀ VIETQR -> GỌI PAYOS TẠO PAYMENT LINK
    let payosData = null;
    if (isVietQR) {
      const payosItems = verifiedOrderItems.map((it) => {
        const prod = productMap.get(it.product_id);
        return {
          name: prod?.name || `Món hàng #${it.product_id}`,
          quantity: it.quantity,
          price: it.unit_price,
        };
      });

      payosData = await createPayOSPaymentLink({
        orderCode: payosNumericCode,
        amount: finalTotal,
        description: `DH ${orderCode.replace(/^ORD-/, "")}`,
        items: payosItems,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: createdOrder.code,
      orderCode: createdOrder.code,
      id: createdOrder.id,
      total: createdOrder.total,
      payos: payosData,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi máy chủ nội bộ";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
