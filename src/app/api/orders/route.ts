import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function POST(req: Request) {
  try {
    const order = await req.json();

    if (!order?.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu email nhận thông báo không hợp lệ." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();

    const rawPaymentStatus = order.paymentStatus as any;
    const dbPaymentStatus = rawPaymentStatus === "paid" || rawPaymentStatus === "Paid" ? "Paid" : "Pending";

    const orderCode = order.orderNumber || order.id || `ORD-${Date.now()}`;
    const customerId = order.customerId || order.customer_id || null;

    const shippingAddr = order.shippingAddress || {};
    const fullFormattedAddress =
      shippingAddr.formattedAddress ||
      `${shippingAddr.line1 || ""}${shippingAddr.line2 ? `, ${shippingAddr.line2}` : ""}, ${shippingAddr.district || ""}, ${shippingAddr.city || ""}, ${shippingAddr.state || "Việt Nam"}`;

    // =========================================================================
    // 1. TẠO ĐỐI TƯỢNG CHÈN DỮ LIỆU AN TOÀN TUYỆT ĐỐI (TRÁNH LỖI SCHEMA CACHE)
    // =========================================================================
    const insertPayload: Record<string, any> = {
      code: orderCode,
      customer_name:
        order.customerName ||
        `${shippingAddr.lastName || ""} ${shippingAddr.firstName || ""}`.trim() ||
        "Khách hàng Storefront",
      customer_email: order.customerEmail.trim().toLowerCase(),
      customer_phone: order.customerPhone || shippingAddr.phone || null,
      shipping_address: {
        ...shippingAddr,
        full_address: fullFormattedAddress,
      },
      payment_method: order.paymentMethod || order.payment_method || "COD",
      payment_status: dbPaymentStatus,
      order_status: "Pending",
      shipping_status: "Pending",
      total: Number(order.total || 0),
      created_at: new Date().toISOString(),
    };

    // Chỉ nạp customer_id nếu có người dùng đăng nhập
    if (customerId) {
      insertPayload.customer_id = customerId;
    }

    // Chỉ nạp ghi chú nếu khách hàng có điền
    if (order.notes) {
      insertPayload.notes = order.notes;
    }

    // Thực hiện chèn đơn hàng
    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert(insertPayload)
      .select("id, code")
      .single();

    if (orderError || !createdOrder) {
      console.error("[SUPABASE_ORDER_INSERT_ERROR]", orderError);
      return NextResponse.json(
        {
          success: false,
          error: `Không thể lưu đơn hàng vào hệ thống: ${orderError?.message}`,
        },
        { status: 500 },
      );
    }

    // =========================================================================
    // 2. CHÈN CHI TIẾT SẢN PHẨM VÀO BẢNG 'order_items'
    // =========================================================================
    if (order.items && order.items.length > 0) {
      const itemsToInsert = order.items.map((item: any) => ({
        order_id: createdOrder.id,
        product_id: item.productId && item.productId.length === 36 ? item.productId : null,
        product_name: item.name || "Sản phẩm chế tác 3D",
        variant_name: item.variantName || "Mặc định",
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.price || 0),
        total_price: Number((item.price || 0) * (item.quantity || 1)),
        created_at: new Date().toISOString(),
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);

      if (itemsError) {
        console.error("[SUPABASE_ORDER_ITEMS_INSERT_ERROR]", itemsError);
      }
    }

    // =========================================================================
    // 3. GỬI EMAIL THÔNG BÁO QUA RESEND API
    // =========================================================================
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "boospace7@gmail.com";
    const senderEmail = "Boospace Store <onboarding@resend.dev>";

    if (resendApiKey) {
      const itemsHtml = (order.items || [])
        .map(
          (item: any) => `
          <tr style="border-bottom: 1px solid #e8e2d2;">
            <td style="padding: 12px 0; font-family: serif; font-size: 14px; font-weight: bold; color: #1c1c1c;">
              ${item.name} ${item.variantName && item.variantName !== "Default Variant" ? `<br/><span style="font-size: 11px; font-family: sans-serif; font-weight: normal; color: #786F66;">Phân loại: ${item.variantName}</span>` : ""}
            </td>
            <td style="padding: 12px 0; text-align: center; font-family: monospace; font-size: 12px; color: #1c1c1c;">
              × ${item.quantity}
            </td>
            <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 13px; font-weight: bold; color: #1c1c1c;">
              ${formatVND((item.price || 0) * (item.quantity || 1))}
            </td>
          </tr>
        `,
        )
        .join("");

      const sendToCustomer = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderEmail,
          to: order.customerEmail,
          subject: `✨ [Boo Space] Biên nhận đơn hàng #${orderCode}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8e2d2; border-radius: 24px; padding: 32px; background-color: #fbf9f4; color: #1c1c1c;">
              <h2 style="font-family: serif; font-weight: bold; font-size: 24px; margin-top: 0; color: #1c1c1c; border-bottom: 1px solid #e8e2d2; padding-bottom: 16px;">
                Cảm ơn bạn đã đặt hàng ✨
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #5c544d;">
                Chào <strong>${order.customerName || "bạn"}</strong>, Boo Space đã ghi nhận yêu cầu chế tác sản phẩm của bạn.
              </p>
              
              <div style="margin: 24px 0; padding: 16px; background-color: #ffffff; border: 1px solid #e8e2d2; border-radius: 16px;">
                <table style="width: 100%; font-size: 12px; font-family: monospace; color: #786F66;">
                  <tr>
                    <td style="padding-bottom: 4px;">MÃ ĐƠN HÀNG:</td>
                    <td style="text-align: right; font-weight: bold; color: #1c1c1c;">#${orderCode}</td>
                  </tr>
                  <tr>
                    <td>NGÀY ĐẶT:</td>
                    <td style="text-align: right; color: #1c1c1c;">${new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                </table>
              </div>

              <h4 style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #786F66; margin-bottom: 8px;">Chi tiết sản phẩm</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                ${itemsHtml}
              </table>

              <table style="width: 100%; font-size: 13px; line-height: 1.8; color: #5c544d; border-top: 1px solid #e8e2d2; padding-top: 16px;">
                <tr>
                  <td>Tạm tính:</td>
                  <td style="text-align: right; font-family: monospace;">${formatVND(order.subtotal || 0)}</td>
                </tr>
                <tr>
                  <td>Phí vận chuyển:</td>
                  <td style="text-align: right; font-family: monospace; font-weight: bold; color: #3ECF8E;">Miễn phí</td>
                </tr>
                <tr style="font-size: 16px; font-weight: bold; color: #1c1c1c;">
                  <td style="padding-top: 12px; font-family: serif;">Tổng thanh toán:</td>
                  <td style="padding-top: 12px; text-align: right; font-family: monospace; color: #FF9D00;">${formatVND(order.total || 0)}</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e8e2d2; font-size: 12px; color: #5c544d;">
                <p style="margin: 0 0 6px 0;"><strong>Địa chỉ giao hàng:</strong></p>
                <p style="margin: 0; font-family: serif; font-style: italic; color: #1c1c1c;">${fullFormattedAddress}</p>
              </div>

              <div style="margin-top: 16px; padding: 12px; background-color: #ffffff; border: 1px solid #e8e2d2; border-radius: 8px; font-size: 12px; color: #5c544d;">
                <p style="margin: 0 0 4px 0;"><strong>Ghi chú chế tác:</strong></p>
                <p style="margin: 0; font-style: italic; color: #1c1c1c;">${order.notes || "Không có yêu cầu riêng"}</p>
              </div>

              <hr style="border: 0; border-top: 1px solid #e8e2d2; margin: 32px 0;" />
              <p style="font-size: 12px; text-align: center; color: #786F66; margin-bottom: 0;">
                BOO SPACE • Biến mọi ý tưởng cá nhân thành sản phẩm thực tế ✨
              </p>
            </div>
          `,
        }),
      });

      const sendToAdmin = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderEmail,
          to: adminEmail,
          subject: `🔔 [ĐƠN HÀNG MỚI] #${orderCode} - ${order.customerName || "Khách hàng"}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1c1c1c; border-radius: 24px; padding: 32px; background-color: #151513; color: #faf5f2;">
              <h2 style="font-family: serif; font-weight: bold; font-size: 22px; margin-top: 0; color: #00e19b; border-bottom: 1px solid #2d2d2a; padding-bottom: 16px;">
                Phát hiện Đơn hàng Mới 🔔
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #b5b0a7;">
                Hệ thống xưởng vừa ghi nhận một giao dịch mới cần chuẩn bị file gia công:
              </p>

              <div style="margin: 24px 0; padding: 16px; background-color: #1e1e1c; border: 1px solid #2d2d2a; border-radius: 16px; font-size: 13px;">
                <p style="margin: 0 0 8px 0;"><strong>Mã đơn hàng:</strong> <span style="color: #FF9D00; font-family: monospace;">#${orderCode}</span></p>
                <p style="margin: 0 0 8px 0;"><strong>Khách hàng:</strong> ${order.customerName || "Khách mua hàng"}</p>
                <p style="margin: 0 0 8px 0;"><strong>Số điện thoại:</strong> ${order.customerPhone || "N/A"}</p>
                <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${order.customerEmail}</p>
                <p style="margin: 0 0 8px 0;"><strong>Hình thức:</strong> ${order.paymentMethod || "COD"}</p>
                <p style="margin: 0 0 8px 0;"><strong>Địa chỉ giao:</strong> ${fullFormattedAddress}</p>
                <p style="margin: 0;"><strong>Tổng tiền:</strong> <span style="color: #00e19b; font-weight: bold; font-family: monospace;">${formatVND(order.total || 0)}</span></p>
              </div>

              <hr style="border: 0; border-top: 1px solid #2d2d2a; margin: 32px 0;" />
              <p style="font-size: 11px; text-align: center; color: #8c857b; margin-bottom: 0;">
                Hệ thống Quản lý Đơn hàng Boospace ©2026.
              </p>
            </div>
          `,
        }),
      });

      Promise.allSettled([sendToCustomer, sendToAdmin]).catch((err) => {
        console.error("[RESEND_PROMISE_ERROR]", err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        order: createdOrder,
        orderId: orderCode,
        message: "Đã lưu đơn hàng thành công!",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[ORDERS_API_CRASH]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo đơn hàng.",
      },
      { status: 500 },
    );
  }
}
