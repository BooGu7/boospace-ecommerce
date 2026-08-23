import { Resend } from "resend";
import { siteConfig } from "./config";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface OrderEmailItem {
  name: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface SendOrderConfirmationParams {
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderEmailItem[];
  subtotal: number;
  discountAmount?: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string | null;
}

/**
 * 1. GỬI EMAIL ĐẶT LẠI MẬT KHẨU
 */
export async function sendResetEmail(email: string, resetUrl: string) {
  if (!resendApiKey) {
    console.warn("[RESEND_WARN] Chưa cấu hình RESEND_API_KEY trong .env.local");
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: "Boo Space <support@boospace.tech>",
    to: email,
    subject: "✨ Đặt lại mật khẩu tài khoản Boo Space",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: auto; padding: 28px; border: 1px solid #e1ddd5; border-radius: 20px; background-color: #fbf9f4; color: #1e1c1a;">
        <h2 style="font-family: serif; color: #000; margin-top: 0;">Boo Space</h2>
        <p>Xin chào,</p>
        <p>Bạn vừa gửi yêu cầu đặt lại mật khẩu cho tài khoản tại Boo Space.</p>
        <div style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 13px;">
            Đặt lại mật khẩu
          </a>
        </div>
        <p style="font-size: 12px; color: #786f66;">Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu, vui lòng bỏ qua thư này.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

/**
 * 2. 🌟 GỬI EMAIL XÁC NHẬN ĐƠN HÀNG & HÓA ĐƠN ĐIỆN TỬ TỰ ĐỘNG
 */
export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationParams,
) {
  if (!resendApiKey) {
    console.warn("[RESEND_WARN] Chưa cấu hình RESEND_API_KEY trong .env.local");
    return null;
  }

  const {
    orderCode,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    subtotal,
    discountAmount = 0,
    shippingFee,
    total,
    paymentMethod,
    notes,
  } = params;

  // Render danh sách món hàng
  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e1ddd5;">
        <td style="padding: 12px 0; text-align: left;">
          <strong style="color: #000; font-size: 13px;">${item.name}</strong>
          ${
            item.variantName &&
            item.variantName !== "Default Variant" &&
            item.variantName !== "Mặc định"
              ? `<br/><span style="display: inline-block; font-size: 10px; font-family: monospace; background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; margin-top: 4px; font-weight: bold; border: 1px solid #fde68a;">${item.variantName}</span>`
              : ""
          }
        </td>
        <td style="padding: 12px 0; text-align: center; font-family: monospace; font-size: 12px;">x${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; font-family: monospace; font-weight: bold; font-size: 13px; color: #000;">
          ${formatVND(item.total)}
        </td>
      </tr>
    `,
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Xác nhận đơn hàng #${orderCode}</title>
      </head>
      <body style="margin: 0; padding: 24px; background-color: #f4f1ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e1c1a;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1ddd5; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
          
          <!-- Header -->
          <div style="background-color: #151513; padding: 32px 28px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-family: serif; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">BOO SPACE</h1>
            <p style="margin: 6px 0 0; font-size: 10px; font-family: monospace; letter-spacing: 1.5px; color: #ff9d00; text-transform: uppercase; font-weight: bold;">
              STUDIO CHẾ TÁC WORKSPACE &amp; IN 3D ON-DEMAND
            </p>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background-color: #ecfdf5; color: #047857; font-size: 10px; font-family: monospace; font-weight: bold; padding: 4px 12px; border-radius: 99px; border: 1px solid #a7f3d0; text-transform: uppercase;">
                ✓ ĐƠN HÀNG ĐÃ XÁC NHẬN
              </span>
              <h2 style="font-family: serif; font-size: 20px; color: #000000; margin: 12px 0 4px;">Cảm ơn bạn đã đặt hàng, ${customerName}! ✨</h2>
              <p style="font-size: 12px; color: #786f66; margin: 0;">
                Mã đơn hàng của bạn: <strong style="font-family: monospace; color: #000; font-size: 13px;">#${orderCode}</strong>
              </p>
            </div>

            <!-- Bảng sản phẩm -->
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="border-bottom: 2px solid #151513; font-size: 10px; font-family: monospace; text-transform: uppercase; color: #786f66;">
                  <th style="text-align: left; padding-bottom: 8px;">Sản phẩm</th>
                  <th style="text-align: center; padding-bottom: 8px;">SL</th>
                  <th style="text-align: right; padding-bottom: 8px;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Tổng kết chi phí -->
            <div style="background-color: #faf5f2; border: 1px solid #e1ddd5; border-radius: 16px; padding: 16px; margin-top: 16px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: #786f66;">Tạm tính:</span>
                <span style="font-family: monospace; font-weight: 600;">${formatVND(subtotal)}</span>
              </div>

              ${
                discountAmount > 0
                  ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #dc2626;">
                      <span>Giảm giá khuyến mãi:</span>
                      <span style="font-family: monospace; font-weight: bold;">-${formatVND(discountAmount)}</span>
                    </div>`
                  : ""
              }

              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: #786f66;">Phí vận chuyển:</span>
                <span style="font-family: monospace; font-weight: bold; color: ${shippingFee === 0 ? "#059669" : "#000"};">
                  ${shippingFee === 0 ? "Miễn phí vận chuyển" : formatVND(shippingFee)}
                </span>
              </div>

              <div style="border-top: 1px solid #e1ddd5; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
                <span style="font-family: serif; color: #000;">Tổng cộng thanh toán:</span>
                <span style="font-family: monospace; color: #ea580c; font-size: 16px;">${formatVND(total)}</span>
              </div>
            </div>

            <!-- Thông tin giao hàng -->
            <div style="margin-top: 20px; padding: 16px; border: 1px solid #e1ddd5; border-radius: 16px; background-color: #ffffff; font-size: 11px; line-height: 1.6;">
              <div style="font-weight: bold; font-family: serif; font-size: 12px; color: #000; margin-bottom: 6px; text-transform: uppercase;">
                📍 Địa chỉ nhận hàng
              </div>
              <div><strong>Người nhận:</strong> ${customerName} • ${customerPhone}</div>
              <div><strong>Địa chỉ:</strong> ${shippingAddress}</div>
              <div><strong>Phương thức:</strong> ${paymentMethod === "VietQR" ? "Chuyển khoản VietQR tự động" : "Thanh toán khi nhận hàng (COD)"}</div>
              ${notes ? `<div><strong>Ghi chú:</strong> <em>${notes}</em></div>` : ""}
            </div>

            <!-- Nút xem đơn hàng -->
            <div style="text-align: center; margin-top: 28px;">
              <a href="https://www.boospace.tech/checkout/success?order_id=${orderCode}" style="background-color: #ff9d00; color: #000000; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                Tra cứu đơn hàng trực tiếp →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #faf5f2; border-top: 1px solid #e1ddd5; padding: 20px 28px; font-size: 10px; color: #786f66; text-align: center; font-family: monospace;">
            <p style="margin: 0 0 4px;">Hotline hỗ trợ: <strong style="color: #000;">${siteConfig.contact.phone}</strong> • Email: <strong style="color: #000;">${siteConfig.contact.email}</strong></p>
            <p style="margin: 0;">Khung giờ hỗ trợ: ${siteConfig.contact.workingHours}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Boo Space Studio <support@boospace.tech>",
      to: customerEmail,
      subject: `✨ Xác nhận đơn hàng #${orderCode} tại Boo Space Studio`,
      html: emailHtml,
    });

    if (error) {
      console.warn("[RESEND_SEND_ERROR]", error);
      // Fallback thử gửi qua tài khoản mặc định nếu domain chưa verify
      return await resend.emails.send({
        from: "Boo Space <onboarding@resend.dev>",
        to: customerEmail,
        subject: `✨ Xác nhận đơn hàng #${orderCode} tại Boo Space Studio`,
        html: emailHtml,
      });
    }

    console.log(
      `✅ [RESEND_SUCCESS] Đã gửi email hóa đơn #${orderCode} tới ${customerEmail}`,
    );
    return data;
  } catch (err) {
    console.error("[RESEND_EXCEPTION]", err);
    return null;
  }
}
