import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Hàm định dạng tiền tệ VND chuẩn xác cho Email HTML
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

    if (!order || !order.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu đơn hàng không hợp lệ." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();

    const rawPaymentStatus = order.paymentStatus as any;
    const dbPaymentStatus =
      rawPaymentStatus === "paid" || rawPaymentStatus === "Paid"
        ? "Paid"
        : "Pending";

    // =========================================================================
    // 1. GHI NHẬN ĐƠN HÀNG VÀO SUPABASE (DATABASE TRANSACTION)
    // =========================================================================

    // 1.1 Lưu đơn hàng cha vào bảng 'orders'
    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        code: order.orderNumber,
        customer_name: order.shippingAddress
          ? `${order.shippingAddress.lastName} ${order.shippingAddress.firstName}`
          : "Khách hàng Storefront",
        customer_email: order.customerEmail,
        total: order.total,
        order_status: "Pending",
        payment_status: dbPaymentStatus,
        shipping_status: "Pending",
      })
      .select("id")
      .single();

    if (orderError || !createdOrder) {
      console.error("SUPABASE ORDER ERROR:", orderError);
      return NextResponse.json(
        { success: false, error: `Lỗi lưu đơn hàng: ${orderError?.message}` },
        { status: 500 },
      );
    }

    // 1.2 Lưu các sản phẩm chi tiết vào bảng 'order_items'
    if (order.items && order.items.length > 0) {
      const itemsToInsert = order.items.map((item: any) => ({
        order_id: createdOrder.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("SUPABASE ORDER ITEMS ERROR:", itemsError);
        // Rollback đơn hàng cha nếu tạo đơn hàng con thất bại
        await supabase.from("orders").delete().eq("id", createdOrder.id);
        return NextResponse.json(
          {
            success: false,
            error: `Lỗi lưu chi tiết đơn hàng: ${itemsError.message}`,
          },
          { status: 500 },
        );
      }
    }

    // ========================================================================
    // 2. TIẾN TRÌNH GỬI 2 EMAIL ĐỒNG THỜI (CLIENT & ADMIN) QUA RESEND API
    // ========================================================================
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "boospace7@gmail.com";
    const senderEmail = "Boo Space <support@boospace.tech>"; // Địa chỉ gửi mặc định

    if (resendApiKey) {
      // Biên soạn danh sách sản phẩm hiển thị dạng bảng HTML trong Email
      const itemsHtml = order.items
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
              ${formatVND(item.price * item.quantity)}
            </td>
          </tr>
        `,
        )
        .join("");

      const addr = order.shippingAddress;
      const addressString = `${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}, ${addr.city}, ${addr.state}`;

      // Email số 1: Gửi cho Khách hàng xác nhận hóa đơn biên nhận [21]
      const sendToCustomer = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderEmail,
          to: order.customerEmail,
          subject: `✨ [Boo Space] Biên nhận đơn hàng #${order.orderNumber}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e8e2d2; border-radius: 24px; padding: 32px; background-color: #fbf9f4; color: #1c1c1c;">
              <h2 style="font-family: serif; font-weight: bold; font-size: 24px; margin-top: 0; color: #1c1c1c; border-bottom: 1px solid #e8e2d2; padding-bottom: 16px;">
                Cảm ơn bạn đã đặt hàng ✨
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #5c544d;">
                Chào <strong>${order.customerName}</strong>, Boo Space đã ghi nhận yêu cầu chế tác sản phẩm của bạn. Dưới đây là biên nhận chi tiết:
              </p>
              
              <div style="margin: 24px 0; padding: 16px; background-color: #ffffff; border: 1px solid #e8e2d2; border-radius: 16px;">
                <table style="width: 100%; font-size: 12px; font-family: monospace; color: #786F66;">
                  <tr>
                    <td style="padding-bottom: 4px;">MÃ ĐƠN HÀNG:</td>
                    <td style="text-align: right; font-weight: bold; color: #1c1c1c;">#${order.orderNumber}</td>
                  </tr>
                  <tr>
                    <td>NGÀY ĐẶT:</td>
                    <td style="text-align: right; color: #1c1c1c;">${new Date(order.createdAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                </table>
              </div>

              <h4 style="font-family: monospace; font-size: 11px; text-transform: uppercase; tracking: 0.1em; color: #786F66; margin-bottom: 8px;">Chi tiết sản phẩm</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                ${itemsHtml}
              </table>

              <table style="width: 100%; font-size: 13px; line-height: 1.8; color: #5c544d; border-top: 1px solid #e8e2d2; padding-top: 16px;">
                <tr>
                  <td>Tạm tính:</td>
                  <td style="text-align: right; font-family: monospace;">${formatVND(order.subtotal)}</td>
                </tr>
                <tr>
                  <td>Phí vận chuyển:</td>
                  <td style="text-align: right; font-family: monospace; font-weight: bold;">${order.shipping === 0 ? "Miễn phí" : formatVND(order.shipping)}</td>
                </tr>
                <tr style="font-size: 16px; font-weight: bold; color: #1c1c1c;">
                  <td style="padding-top: 12px; font-family: serif;">Tổng cộng COD:</td>
                  <td style="padding-top: 12px; text-align: right; font-family: monospace; color: #FF9D00;">${formatVND(order.total)}</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e8e2d2; font-size: 12px; color: #5c544d;">
                <p style="margin: 0 0 6px 0;"><strong>Địa chỉ giao hàng:</strong></p>
                <p style="margin: 0; font-family: serif; font-style: italic; color: #1c1c1c;">${addressString}</p>
              </div>

              <hr style="border: 0; border-top: 1px solid #e8e2d2; margin: 32px 0;" />
              <p style="font-size: 12px; text-align: center; color: #786F66; margin-bottom: 0;">
                BOO SPACE • Biến mọi ý tưởng cá nhân thành sản phẩm thực tế ✨
              </p>
            </div>
          `,
        }),
      });

      // Email số 2: Gửi cho bạn (Admin) thông báo nạp file gia công [21]
      const sendToAdmin = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderEmail,
          to: adminEmail,
          subject: `🔔 [ĐƠN HÀNG MỚI] #${order.orderNumber} - ${order.customerName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1c1c1c; border-radius: 24px; padding: 32px; background-color: #151513; color: #faf5f2;">
              <h2 style="font-family: serif; font-weight: bold; font-size: 22px; margin-top: 0; color: #00e19b; border-bottom: 1px solid #2d2d2a; padding-bottom: 16px;">
                Phát hiện Đơn hàng Mới 🔔
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #b5b0a7;">
                Hệ thống xưởng vừa ghi nhận một giao dịch mới cần chuẩn bị file gia công và vận chuyển [21]:
              </p>

              <div style="margin: 24px 0; padding: 16px; background-color: #1e1e1c; border: 1px solid #2d2d2a; border-radius: 16px; font-size: 13px;">
                <p style="margin: 0 0 8px 0;"><strong>Khách hàng:</strong> ${order.customerName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Email liên hệ:</strong> ${order.customerEmail}</p>
                <p style="margin: 0 0 8px 0;"><strong>Địa chỉ giao:</strong> ${addressString}</p>
                <p style="margin: 0;"><strong>Tổng tiền thu COD:</strong> <span style="color: #00e19b; font-weight: bold; font-family: monospace;">${formatVND(order.total)}</span></p>
              </div>

              <h4 style="font-family: monospace; font-size: 11px; text-transform: uppercase; tracking: 0.1em; color: #8c857b; margin-bottom: 8px;">Sản phẩm cần chuẩn bị</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; color: #faf5f2;">
                ${order.items
                  .map(
                    (item: any) => `
                    <tr style="border-bottom: 1px solid #2d2d2a;">
                      <td style="padding: 12px 0; font-family: serif; font-size: 14px; font-weight: bold;">
                        ${item.name} ${item.variantName && item.variantName !== "Default Variant" ? `<br/><span style="font-size: 11px; font-family: sans-serif; font-weight: normal; color: #8c857b;">Phân loại: ${item.variantName}</span>` : ""}
                      </td>
                      <td style="padding: 12px 0; text-align: center; font-family: monospace; font-size: 12px;">
                        × ${item.quantity}
                      </td>
                    </tr>
                  `,
                  )
                  .join("")}
              </table>

              <hr style="border: 0; border-top: 1px solid #2d2d2a; margin: 32px 0;" />
              <p style="font-size: 11px; text-align: center; color: #8c857b; margin-bottom: 0;">
                Hệ thống Quản lý Đơn hàng Tự động Boospace ©2026 • Supabase RLS Protected.
              </p>
            </div>
          `,
        }),
      });

      // Thực hiện gửi song song 2 email để không làm tăng thời gian chờ của luồng thanh toán [21]
      Promise.allSettled([sendToCustomer, sendToAdmin]).then((results) => {
        results.forEach((result, idx) => {
          if (result.status === "rejected") {
            console.error(
              `[RESEND_ERROR] Không thể gửi email ${idx === 0 ? "Khách hàng" : "Admin"}:`,
              result.reason,
            );
          }
        });
      });
    } else {
      console.warn(
        "[WARNING] Chưa cấu hình RESEND_API_KEY. Hệ thống chỉ ghi nhận dữ liệu xuống Supabase.",
      );
    }

    return NextResponse.json({ order: createdOrder }, { status: 201 });
  } catch (error: any) {
    console.error("[ORDERS_API_ERROR]", error);
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
