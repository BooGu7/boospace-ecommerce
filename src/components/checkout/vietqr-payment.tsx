"use client";

import {
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

interface QRPaymentProps {
  orderId: string;
  amount: number;
  payosQrCode?: string;
  payosCheckoutUrl?: string;
  onSuccess?: () => void;
}

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function VietQRPayment({
  orderId,
  amount,
  payosQrCode,
  payosCheckoutUrl,
  onSuccess,
}: QRPaymentProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const isPaidRef = useRef(false);

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(
    payosCheckoutUrl || null,
  );
  const [qrCodeRaw, setQrCodeRaw] = useState<string | null>(
    payosQrCode || null,
  );

  const [bankInfo, setBankInfo] = useState({
    bankCode: "ACB",
    accountNumber: "2077867",
    accountName: "TON THAT TRONG",
  });

  useEffect(() => {
    async function loadGateway() {
      try {
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
        }
      } catch {
        // Bỏ qua lỗi
      }
    }

    loadGateway();
  }, []);

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

  const verifyPaymentStatus = useCallback(
    async (showToast = false) => {
      if (isPaidRef.current) return false;

      try {
        const res = await fetch(
          `/api/orders?order_id=${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        );

        if (res.ok) {
          const result = await res.json();

          if (result.payos?.checkoutUrl && !checkoutUrl) {
            setCheckoutUrl(result.payos.checkoutUrl);
          }
          if (result.payos?.qrCode && !qrCodeRaw) {
            setQrCodeRaw(result.payos.qrCode);
          }

          if (
            result.success &&
            (result.isPaid ||
              String(result.order?.payment_status).toLowerCase() === "paid")
          ) {
            isPaidRef.current = true;
            setIsPaid(true);
            toast.success(
              "Xác nhận thanh toán PayOS thành công! Đơn hàng đang được gia công in ✨",
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
      } catch {
        if (showToast) {
          toast.error("Không thể kết nối máy chủ kiểm tra thanh toán.");
        }
      }
      return false;
    },
    [orderId, checkoutUrl, qrCodeRaw, onSuccess],
  );

  useEffect(() => {
    if (isPaid) return;

    const pollInterval = setInterval(() => {
      if (!isPaidRef.current && timeLeft > 0) {
        verifyPaymentStatus(false);
      }
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [isPaid, timeLeft, verifyPaymentStatus]);

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
            String(updatedOrder.payment_status).toLowerCase() === "paid"
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

  const transferMemo = orderId.replace(/[^a-zA-Z0-9]/g, "");

  const qrDisplayUrl = qrCodeRaw
    ? `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qrCodeRaw)}`
    : `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

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
            Thanh toán VietQR (PayOS)
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
          src={qrDisplayUrl}
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
        <strong>{transferMemo}</strong> khi quét mã để hệ thống tự động nhận
        diện trong 1 giây.
      </div>

      {checkoutUrl && (
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full h-10 bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
        >
          <ExternalLink className="size-4" /> Mở trang thanh toán PayOS
        </a>
      )}

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
