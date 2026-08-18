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

const GHN_TOKEN =
  process.env.GHN_API_TOKEN || "57206f75-cdcf-11ef-ac7c-e6d0c03032ee";
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || "1953208";

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

    // 3. Ngoại tỉnh (< 500k, VD: Gia Lai, Đà Nẵng, Hà Nội...) -> Gọi thẳng GHN API v2
    const targetDistrict = districtId > 0 ? districtId : 1580; // Mặc định Pleiku nếu chưa chọn
    const targetWard = wardCode || "420101";

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
          from_district_id: 1446, // Kho Q.Bình Thạnh, TP.HCM
          from_ward_code: "20601",
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
