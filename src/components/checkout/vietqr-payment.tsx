"use client";

import {
  CheckCircle2,
  Clock,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

interface QRPaymentProps {
  orderId: string;
  amount: number;
  sku?: string;
  onSuccess?: () => void;
}

const formatVND = (amount: number) => {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} VNĐ`;
};

export function VietQRPayment({
  orderId,
  amount,
  sku,
  onSuccess,
}: QRPaymentProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const isPaidRef = useRef(false);

  // CẤU HÌNH NGÂN HÀNG MẶC ĐỊNH
  const [bankInfo, setBankInfo] = useState({
    bankCode: "ACB",
    accountNumber: "2077867",
    accountName: "TON THAT TRONG",
  });

  // 1. NẠP ĐỘNG CẤU HÌNH NGÂN HÀNG TỪ SUPABASE (ĐỒNG BỘ VỚI ADMIN DASHBOARD)
  useEffect(() => {
    async function loadPaymentGateway() {
      try {
        // Ưu tiên đọc từ settings tài chính của xưởng
        const { data: settingsData } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "finance_settings")
          .maybeSingle();

        if (settingsData?.value?.bank_config) {
          const cfg = settingsData.value.bank_config;
          setBankInfo({
            bankCode: cfg.bank_code || "ACB",
            accountNumber: cfg.account_number || "2077867",
            accountName: cfg.account_name || "TON THAT TRONG",
          });
          return;
        }

        // Fallback đọc từ payment_gateways
        const { data: gwData } = await supabase
          .from("payment_gateways")
          .select("bank_code, account_number, account_name")
          .eq("is_active", true)
          .maybeSingle();

        if (gwData) {
          setBankInfo({
            bankCode: gwData.bank_code || "ACB",
            accountNumber: gwData.account_number || "2077867",
            accountName: gwData.account_name || "TON THAT TRONG",
          });
        }
      } catch (err) {
        console.error("Lỗi nạp cấu hình cổng thanh toán:", err);
      }
    }

    loadPaymentGateway();
  }, []);

  // 2. ĐẾM NGƯỢC 10 PHÚT
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // 3. HÀM KIỂM TRA TRẠNG THÁI THANH TOÁN QUA SERVER API (VƯỢT QUA 100% RLS SUPABASE)
  const verifyPaymentStatus = async (showToast = false) => {
    if (isPaidRef.current) return;

    try {
      // Gọi qua API Route Server (có quyền Admin bypass RLS an toàn)
      const res = await fetch(
        `/api/orders?order_id=${encodeURIComponent(orderId)}`,
        {
          cache: "no-store",
        },
      );

      if (res.ok) {
        const result = await res.json();
        if (
          result.success &&
          (result.isPaid || result.order?.payment_status === "Paid")
        ) {
          isPaidRef.current = true;
          setIsPaid(true);
          toast.success(
            "Xác nhận thanh toán thành công! Đơn hàng đang được gia công in ✨",
          );
          onSuccess?.();
          return true;
        }
      }

      if (showToast) {
        toast.info(
          "Hệ thống đang chờ ngân hàng xác nhận giao dịch. Vui lòng đợi trong giây lát ✨",
        );
      }
    } catch (_err) {
      if (showToast) {
        toast.error("Không thể kết nối máy chủ kiểm tra thanh toán.");
      }
    }
    return false;
  };

  // 4. CƠ CHẾ POLLING TỰ ĐỘNG MỖI 3.5 GIÂY (CHUYỂN MÀN HÌNH TỰ ĐỘNG KHÔNG CẦN BẤM NÚT)
  useEffect(() => {
    if (isPaid) return;

    // Kiểm tra ngay lần đầu
    verifyPaymentStatus(false);

    // Lặp lại tự động mỗi 3.5 giây
    const pollInterval = setInterval(() => {
      if (!isPaidRef.current && timeLeft > 0) {
        verifyPaymentStatus(false);
      }
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [orderId, isPaid, timeLeft]);

  // 5. LẮNG NGHE SUPABASE REALTIME ĐỒNG THỜI (CHUẨN HÓA BỎ MỌI TIỀN TỐ)
  useEffect(() => {
    const cleanId = orderId.replace(/^(ORD|BOO)-?/i, "").toUpperCase();

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const updatedOrder = payload.new;
          const targetCode = String(updatedOrder.code || "")
            .replace(/^(ORD|BOO)-?/i, "")
            .toUpperCase();

          if (
            (targetCode === cleanId ||
              updatedOrder.id === orderId ||
              updatedOrder.code === orderId) &&
            updatedOrder.payment_status === "Paid"
          ) {
            isPaidRef.current = true;
            setIsPaid(true);
            toast.success(
              "Thanh toán thành công! Đơn hàng đang được gia công in ✨",
            );
            onSuccess?.();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, onSuccess]);

  const cleanSku = sku ? sku.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase() : "";
  const transferMemo = cleanSku ? `${orderId} ${cleanSku}` : orderId;

  const template = "compact2";
  const qrImageUrl = `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  // GIAO DIỆN KHI ĐÃ THANH TOÁN THÀNH CÔNG (PAID)
  if (isPaid) {
    return (
      <div className="rounded-3xl border border-[#3ECF8E]/30 bg-[#3ECF8E]/5 p-6 text-center space-y-4 max-w-sm mx-auto shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="size-14 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>
        <div className="space-y-1">
          <h4 className="font-serif text-lg font-bold text-black">
            Xác nhận thanh toán thành công!
          </h4>
          <p className="text-xs text-[#786F66] leading-relaxed">
            Hệ thống đã nhận đủ{" "}
            <span className="font-mono font-bold text-emerald-700">
              {formatVND(amount)}
            </span>
            . Đơn hàng{" "}
            <strong className="font-mono text-black">{orderId}</strong> đã được
            kích hoạt và chuyển tới xưởng in 3D BooSpace.
          </p>
        </div>
      </div>
    );
  }

  // NÚT KIỂM TRA THỦ CÔNG
  const handleManualCheck = async () => {
    setIsChecking(true);
    await verifyPaymentStatus(true);
    setIsChecking(false);
  };

  const handleResetTimer = () => {
    setTimeLeft(600);
    toast.success("Đã làm mới mã QR thêm 10 phút ✨");
  };

  const isExpired = timeLeft <= 0;

  return (
    <div className="rounded-3xl border border-[#DCD6CC] bg-white p-6 shadow-sm space-y-5 text-left max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-black flex items-center gap-2">
            <ShieldCheck className="size-5 text-[#FF9D00]" />
            Thanh toán VietQR
          </h3>
          <p className="text-xs text-[#786F66] font-sans">
            Tài khoản nhận: {bankInfo.bankCode} ({bankInfo.accountNumber})
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold shrink-0 ${
            isExpired
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-[#FCFAF2] text-[#FF9D00] border-[#FF9D00]/30"
          }`}
        >
          <Clock className={`size-3.5 ${!isExpired ? "animate-pulse" : ""}`} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="relative aspect-square w-full rounded-2xl border border-[#E1DDD5] bg-[#FCFAF2]/40 overflow-hidden flex items-center justify-center p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrImageUrl}
          alt={`Mã VietQR thanh toán đơn hàng ${orderId}`}
          className={`object-contain size-full transition-all duration-300 ${
            isExpired ? "blur-md opacity-30" : ""
          }`}
        />

        {isExpired && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
            <p className="text-xs font-bold text-white leading-relaxed">
              Mã QR đã hết hạn hiệu lực (10 phút).
            </p>
            <Button
              type="button"
              onClick={handleResetTimer}
              size="sm"
              className="bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-[10px] font-bold tracking-wider rounded-xl gap-1.5 cursor-pointer shadow-sm"
            >
              <RotateCcw className="size-3.5" />
              Làm mới mã QR
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2.5 border-t border-[#E1DDD5]/60 pt-4 text-xs font-sans">
        <div className="flex justify-between items-center">
          <span className="text-[#786F66]">Số tiền cần chuyển:</span>
          <span className="font-mono font-bold text-black text-sm">
            {formatVND(amount)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#786F66]">Nội dung chuyển khoản:</span>
          <span className="font-mono font-bold text-red-500 text-xs tracking-wide">
            {transferMemo}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-[#FCFAF2] border border-[#E1DDD5] p-3 text-[10px] text-[#5c544d] leading-relaxed">
        💡 <strong>Lưu ý:</strong> Vui lòng giữ nguyên nội dung{" "}
        <strong>{transferMemo}</strong> khi chuyển khoản để máy chủ tự nhận diện
        đơn hàng.
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleManualCheck}
        disabled={isChecking || isExpired}
        className="w-full h-10 text-xs font-mono uppercase font-bold tracking-wider rounded-xl cursor-pointer hover:bg-slate-50 transition-colors gap-2"
      >
        <RefreshCw className={`size-3.5 ${isChecking ? "animate-spin" : ""}`} />
        Tôi đã chuyển khoản, kiểm tra lại
      </Button>
    </div>
  );
}
