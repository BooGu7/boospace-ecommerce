import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface DbProductItem {
  id: string;
  name: string;
  price: number | string | null;
  published: boolean | null;
}

// 1. HÀM GET LẤY THÔNG TIN ĐƠN HÀNG DỰA VÀO CỘT CODE
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng." },
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let supabaseAdmin: any;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch (_err) {
      supabaseAdmin = createSupabaseServerClient();
    }

    // Truy vấn đơn hàng theo cột 'code'
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("code", code)
      .maybeSingle();

    if (error || !order) {
      console.error("[API_GET_ORDER_NOT_FOUND]", error);
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng." },
        { status: 404 },
      );
    }

    // Dự phòng nếu quan hệ order_items chưa nạp
    if (order && (!order.order_items || order.order_items.length === 0)) {
      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      order.order_items = items || [];
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("[API_GET_ORDER_ERROR]", err);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ nội bộ." },
      { status: 500 },
    );
  }
}

// 2. HÀM POST TẠO ĐƠN HÀNG MỚI (CHỦ ĐỘNG ĐỂ POSTGRES TỰ SINH UUID CHO CỘT ID)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerEmail = (
      body.customerEmail ||
      body.customer_email ||
      body.email ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase();
    const customerName = (
      body.customerName ||
      body.customer_name ||
      body.name ||
      ""
    )
      .toString()
      .trim();
    const customerPhone = (
      body.customerPhone ||
      body.customer_phone ||
      body.phone ||
      ""
    )
      .toString()
      .trim();

    // Đảm bảo customer_id phải là UUID hợp lệ hoặc NULL
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
    const isVietQR = rawPaymentMethod.toLowerCase().includes("vietqr");
    const savedPaymentMethod = isVietQR ? "VietQR" : "COD";

    const shippingAddress = body.shippingAddress || body.shipping_address || {};
    const notes = body.notes || "";
    const couponCode = body.couponCode || body.coupon_code || "";
    const items = body.items || [];

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Giỏ hàng không có sản phẩm." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu email nhận thông báo không hợp lệ." },
        { status: 400 },
      );
    }

    if (!customerPhone || !customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu thông tin người nhận hàng hoặc số điện thoại.",
        },
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let supabaseAdmin: any;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch (_err) {
      supabaseAdmin = createSupabaseServerClient();
    }

    // LẤY GIÁ BÁN THỰC TẾ TỪ SUPABASE DATABASE
    const productIds = items.map(
      (i: { productId?: string; product_id?: string }) =>
        i.productId || i.product_id,
    );
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
      const pId = item.productId || item.product_id;
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
        unit_price: realUnitPrice,
        total_price: lineTotal,
      });
    }

    // XÁC THỰC MÃ GIẢM GIÁ
    let discountPercent = 0;
    let appliedCouponId: string | null = null;

    if (couponCode && typeof couponCode === "string") {
      const { data: couponData } = await supabaseAdmin
        .from("coupons")
        .select("id, code, discount_percent, active")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("active", true)
        .maybeSingle();

      if (couponData) {
        discountPercent = couponData.discount_percent;
        appliedCouponId = couponData.id;
      }
    }

    const discountAmount = Math.round(
      calculatedSubtotal * (discountPercent / 100),
    );

    // TÍNH PHÍ VẬN CHUYỂN
    const city = shippingAddress?.city || "";
    const isHCM =
      city.toLowerCase().includes("hồ chí minh") ||
      city.toLowerCase().includes("hcm");
    const serverShippingFee = isHCM ? 0 : siteConfig.shipping.standardFee;

    const finalTotal = calculatedSubtotal - discountAmount + serverShippingFee;
    const orderCode =
      body.orderNumber ||
      body.code ||
      `ORD-${Date.now().toString(36).toUpperCase()}`;
    const formattedAddressStr =
      shippingAddress?.formattedAddress ||
      `${shippingAddress?.line1 || ""}, ${shippingAddress?.district || ""}, ${shippingAddress?.city || ""}`;

    // LƯU ĐƠN HÀNG (KHÔNG TRUYỀN ID CỨNG ĐỂ POSTGRES TỰ TẠO UUID HỢP LỆ)
    const { data: createdOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        code: orderCode, // Mã dạng chuỗi ORD-...
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_address: formattedAddressStr,
        shipping_address: shippingAddress || {},
        subtotal: calculatedSubtotal,
        shipping: serverShippingFee,
        total: finalTotal,
        order_status: "Pending",
        payment_status: "Pending",
        payment_method: savedPaymentMethod,
        applied_coupon_id: appliedCouponId,
        notes: notes || "",
      })
      .select("id, code, total")
      .single();

    if (orderError || !createdOrder) {
      console.error("[SERVER_ORDER_INSERT_ERROR]", orderError);
      return NextResponse.json(
        {
          success: false,
          error: `Không thể tạo đơn hàng: ${orderError?.message}`,
        },
        { status: 500 },
      );
    }

    // CHÈN SẢN PHẨM VÀO BẢNG ORDER_ITEMS
    const itemsToInsert = verifiedOrderItems.map((item) => ({
      order_id: createdOrder.id, // Sử dụng UUID thực tế vừa tạo
      ...item,
    }));

    const { error: itemsInsertError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsInsertError) {
      console.error("[SERVER_ITEMS_INSERT_ERROR]", itemsInsertError);
      await supabaseAdmin.from("orders").delete().eq("id", createdOrder.id);
      return NextResponse.json(
        { success: false, error: "Lỗi lưu chi tiết đơn hàng." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      orderId: createdOrder.code,
      total: createdOrder.total,
    });
  } catch (err) {
    console.error("[API_ORDERS_ERROR]", err);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ nội bộ." },
      { status: 500 },
    );
  }
}
