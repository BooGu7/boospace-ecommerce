import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

const HCM_KEYWORDS = [
  "hồ chí minh",
  "ho chi minh",
  "hcm",
  "sài gòn",
  "saigon",
  "tp.hcm",
  "tphcm",
];

const GHN_TOKEN = process.env.GHN_API_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;
const GHN_WORKSHOP_DISTRICT_ID = Number(
  process.env.GHN_WORKSHOP_DISTRICT_ID || 1462,
);
const GHN_WORKSHOP_WARD_CODE =
  process.env.GHN_WORKSHOP_WARD_CODE || "21617";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const city = (body.city || "").toString().trim().toLowerCase();
    const districtId = Number(body.districtId || 0);
    const wardCode = (body.wardCode || "").toString().trim();
    const subtotalVND = Number(body.subtotal || 0);
    const weightGrams = Number(body.weightGrams || 380);

    // 1. Miễn phí nội thành TP.HCM (0 ₫)
    const isHCM = HCM_KEYWORDS.some((kw) => city.includes(kw));
    if (isHCM) {
      return NextResponse.json({
        success: true,
        fee: 0,
        isFree: true,
        reason: "Miễn phí nội thành TP.HCM",
      });
    }

    // 2. Miễn phí toàn quốc cho đơn >= 500.000 ₫ (0 ₫)
    if (subtotalVND >= (siteConfig.freeShippingThreshold || 500000)) {
      return NextResponse.json({
        success: true,
        fee: 0,
        isFree: true,
        reason: "Miễn phí toàn quốc cho đơn từ 500.000 ₫",
      });
    }

    // 3. Ngoại tỉnh (< 500k) cần đủ mã GHN để tính cước chính xác.
    if (!districtId || !wardCode) {
      return NextResponse.json(
        { success: false, fee: 0, isFree: false, error: "Thiếu mã quận/huyện hoặc phường/xã GHN." },
        { status: 400 },
      );
    }
    if (!GHN_TOKEN || !GHN_SHOP_ID) {
      return NextResponse.json(
        { success: false, fee: 0, isFree: false, error: "Thiếu cấu hình GHN_API_TOKEN hoặc GHN_SHOP_ID." },
        { status: 500 },
      );
    }

    const targetDistrict = districtId;
    const targetWard = wardCode;

    const ghnRes = await fetch(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN,
          ShopId: String(GHN_SHOP_ID),
        },
        body: JSON.stringify({
          from_district_id: GHN_WORKSHOP_DISTRICT_ID,
          from_ward_code: GHN_WORKSHOP_WARD_CODE,
          to_district_id: targetDistrict,
          to_ward_code: targetWard,
          weight: weightGrams,
          length: 20,
          width: 15,
          height: 10,
          service_type_id: 2, // Chuẩn E-Commerce
          insurance_value: Math.min(subtotalVND, 5000000),
        }),
      },
    );

    const ghnData = await ghnRes.json();
    if (ghnRes.ok && ghnData?.code === 200 && ghnData.data?.total) {
      return NextResponse.json({
        success: true,
        fee: Number(ghnData.data.total),
        isFree: false,
        reason: "Giao hàng tiêu chuẩn toàn quốc",
      });
    }

    return NextResponse.json({
      success: true,
      fee: 34000,
      isFree: false,
      reason: "Giao hàng tiêu chuẩn toàn quốc",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi tính cước";
    return NextResponse.json(
      { success: false, fee: 34000, isFree: false, error: msg },
      { status: 500 },
    );
  }
}
