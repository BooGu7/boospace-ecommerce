import { NextResponse } from "next/server";

const GHN_TOKEN =
  process.env.GHN_API_TOKEN || "57206f75-cdcf-11ef-ac7c-e6d0c03032ee";
const GHN_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provinceId = searchParams.get("provinceId");
    const districtId = searchParams.get("districtId");

    // 1. NẾU CÓ DISTRICT_ID -> LẤY DANH SÁCH PHƯỜNG / XÃ (WARDS)
    if (districtId) {
      const res = await fetch(
        `${GHN_BASE_URL}/master-data/ward?district_id=${districtId}`,
        {
          headers: { "Content-Type": "application/json", Token: GHN_TOKEN },
          next: { revalidate: 86400 },
        },
      );
      const data = await res.json();
      if (res.ok && data?.code === 200) {
        return NextResponse.json({ success: true, data: data.data || [] });
      }
      return NextResponse.json({ success: true, data: [] });
    }

    // 2. NẾU CÓ PROVINCE_ID -> LẤY DANH SÁCH QUẬN / HUYỆN (DISTRICTS)
    if (provinceId) {
      const res = await fetch(`${GHN_BASE_URL}/master-data/district`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Token: GHN_TOKEN },
        body: JSON.stringify({ province_id: Number(provinceId) }),
        next: { revalidate: 86400 },
      });
      const data = await res.json();
      if (res.ok && data?.code === 200) {
        return NextResponse.json({ success: true, data: data.data || [] });
      }
      return NextResponse.json({ success: true, data: [] });
    }

    // 3. MẶC ĐỊNH -> LẤY DANH SÁCH 63 TỈNH / THÀNH PHỐ (PROVINCES)
    const res = await fetch(`${GHN_BASE_URL}/master-data/province`, {
      headers: { "Content-Type": "application/json", Token: GHN_TOKEN },
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    if (res.ok && data?.code === 200) {
      return NextResponse.json({ success: true, data: data.data || [] });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi nạp địa chỉ";
    return NextResponse.json(
      { success: false, error: msg, data: [] },
      { status: 500 },
    );
  }
}
