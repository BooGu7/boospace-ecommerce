import crypto from "node:crypto";

const clientId = process.env.PAYOS_CLIENT_ID || "";
const apiKey = process.env.PAYOS_API_KEY || "";
const checksumKey = process.env.PAYOS_CHECKSUM_KEY || "";

export interface PayOSItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CreatePayOSLinkParams {
  orderCode: number;
  amount: number;
  description: string;
  items?: PayOSItem[];
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PayOSWebhookData {
  orderCode: number;
  amount: number;
  description: string;
  accountNumber: string;
  reference: string;
  transactionDateTime: string;
  currency: string;
  paymentLinkId: string;
  code: string;
  desc: string;
}

export interface PayOSWebhookPayload {
  code: string;
  desc: string;
  data: PayOSWebhookData;
  signature: string;
}

/**
 * 1. TẠO CHỮ KÝ HMAC SHA-256 CHO PAYOS (CHỐNG LỖI CONSTRUCTOR TURBOPACK)
 */
function createSignature(dataStr: string, key: string): string {
  return crypto.createHmac("sha256", key).update(dataStr).digest("hex");
}

/**
 * 2. TẠO LINK & MÃ QR THANH TOÁN PAYOS (CHUẨN OPEN API PAYOS V2)
 */
export async function createPayOSPaymentLink(params: CreatePayOSLinkParams) {
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.boospace.tech";

    const cleanDescription = params.description
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .slice(0, 25);

    const amount = Math.round(params.amount);
    const cancelUrl = params.cancelUrl || `${origin}/checkout`;
    const returnUrl =
      params.returnUrl ||
      `${origin}/checkout/success?order_id=${params.orderCode}`;

    // Chuỗi ký bắt buộc của PayOS
    const signatureData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${cleanDescription}&orderCode=${params.orderCode}&returnUrl=${returnUrl}`;
    const signature = createSignature(signatureData, checksumKey);

    const bodyPayload = {
      orderCode: params.orderCode,
      amount,
      description: cleanDescription,
      items: params.items || [
        {
          name: `Don hang #${params.orderCode}`,
          quantity: 1,
          price: amount,
        },
      ],
      cancelUrl,
      returnUrl,
      signature,
    };

    const res = await fetch(
      "https://api-merchant.payos.vn/v2/payment-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": clientId,
          "x-api-key": apiKey,
        },
        body: JSON.stringify(bodyPayload),
      },
    );

    const result = await res.json();

    if (result.code === "00" && result.data) {
      return {
        success: true,
        checkoutUrl: result.data.checkoutUrl,
        qrCode: result.data.qrCode,
        orderCode: result.data.orderCode,
        paymentLinkId: result.data.paymentLinkId,
      };
    }

    return {
      success: false,
      error: result.desc || "Không thể tạo link thanh toán PayOS",
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Lỗi tạo link thanh toán PayOS";
    console.error("[PAYOS_CREATE_LINK_EXCEPTION]", msg);
    return { success: false, error: msg };
  }
}

/**
 * 3. XÁC THỰC CHỮ KÝ WEBHOOK PAYOS (HMAC SHA-256)
 */
export function verifyPayOSWebhookData(
  webhookBody: PayOSWebhookPayload,
): PayOSWebhookData | null {
  try {
    const data = webhookBody.data;
    if (!data || !webhookBody.signature) return null;

    // Sắp xếp các khóa theo bảng chữ cái theo chuẩn PayOS
    const sortedKeys = Object.keys(data).sort();
    const signData = sortedKeys
      .map((k) => `${k}=${data[k as keyof PayOSWebhookData] ?? ""}`)
      .join("&");

    const expectedSignature = createSignature(signData, checksumKey);

    if (expectedSignature === webhookBody.signature) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
