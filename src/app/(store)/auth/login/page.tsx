import { Suspense } from "react";
import LoginClient from "./LoginClient";

// Khung tải chờ tối giản đồng bộ hệ màu ngà cát ấm áp của Daylight
function LoginFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#FCFAF2]">
      <div className="flex flex-col items-center space-y-4">
        {/* Vòng xoay dẹt dẹp cát mờ có điểm nhấn hổ phách */}
        <span className="size-6 rounded-full border-2 border-[#E1DDD5] border-t-[#FF9D00] animate-spin" />
        <p className="text-[10px] font-mono text-[#786F66] uppercase tracking-widest font-semibold animate-pulse">
          Xác thực kết nối...
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginClient />
    </Suspense>
  );
}
