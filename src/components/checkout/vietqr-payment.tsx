"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface QRPaymentProps {
  orderId: string;
  amount: number;
  sku?: string; // Bổ sung thuộc tính SKU sản phẩm
}

const formatVND = (amount: number) => {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} VNĐ`;
};

export function VietQRPayment({ orderId, amount, sku }: QRPaymentProps) {
  const router = useRouter();
  const [isPaid, setIsPaid] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(300);

  const [bankInfo, setBankInfo] = React.useState({
    bankCode: "ACB",
    accountNumber: "2077867",
    accountName: "TON THAT TRONG",
  });

  // Tải cấu hình ngân hàng từ Supabase
  React.useEffect(() => {
    async function loadPaymentGateway() {
      try {
        const { data, error } = await supabase
          .from("payment_gateways")
          .select("bank_code, account_number, account_name")
          .eq("code", "VIETQR_ACB")
          .eq("is_active", true)
          .maybeSingle();

        if (!error && data) {
          setBankInfo({
            bankCode: data.bank_code || "ACB",
            accountNumber: data.account_number || "2077867",
            accountName: data.account_name || "TON THAT TRONG",
          });
        }
      } catch (err) {
        console.error("Lỗi nạp cấu hình cổng thanh toán:", err);
      }
    }

    loadPaymentGateway();
  }, []);

  // Xử lý đếm ngược 5 phút
  React.useEffect(() => {
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

  // Đăng ký kênh lắng nghe trạng thái thanh toán Realtime từ Supabase
  React.useEffect(() => {
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updatedOrder = payload.new;
          if (updatedOrder.payment_status === "Paid") {
            setIsPaid(true);
            toast.success(
              "Thanh toán thành công! Đơn hàng đang được gia công in ✨",
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Xử lý tạo Chuỗi Nội dung chuyển khoản kết hợp Mã Đơn Hàng + SKU (Làm sạch ký tự tiếng Việt)
  const cleanSku = sku ? sku.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase() : "";
  const transferMemo = cleanSku ? `${orderId} ${cleanSku}` : orderId;

  // Sinh mã QR VietQR chứa chuỗi Nội dung chuyển khoản Mới
  const template = "compact2";
  const qrImageUrl = `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  if (isPaid) {
    return (
      <div className="rounded-3xl border border-[#3ECF8E]/30 bg-[#3ECF8E]/5 p-6 text-center space-y-4 max-w-sm mx-auto">
        <div className="size-12 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-serif text-base font-bold text-black">
            Xác nhận thanh toán thành công!
          </h4>
          <p className="text-xs text-[#786F66]">
            Hệ thống đã nhận đủ{" "}
            <span className="font-mono font-bold text-black">
              {formatVND(amount)}
            </span>
            . Đơn hàng <strong className="font-mono">{orderId}</strong> đã được
            chuyển tới xưởng gia công.
          </p>
        </div>
      </div>
    );
  }

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("id", orderId)
        .maybeSingle();

      if (!error && data?.payment_status === "Paid") {
        setIsPaid(true);
        toast.success("Hệ thống đã ghi nhận thanh toán thành công!");
      } else {
        toast.info(
          "Chưa ghi nhận giao dịch chuyển khoản mới. Vui lòng đợi trong giây lát ✨",
        );
      }
    } catch {
      toast.error("Có lỗi xảy ra khi kiểm tra đơn hàng");
    } finally {
      setIsChecking(false);
    }
  };

  const handleResetTimer = () => {
    setTimeLeft(300);
    toast.success("Đã làm mới mã QR thêm 5 phút ✨");
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
        <img
          src={qrImageUrl}
          alt={`Mã VietQR thanh toán đơn hàng ${orderId}`}
          className={`object-contain size-full transition-all duration-300 ${isExpired ? "blur-md opacity-30" : ""}`}
        />

        {isExpired && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
            <p className="text-xs font-bold text-white leading-relaxed">
              Mã QR đã hết hạn hiệu lực (5 phút).
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

      {/* Hiển thị chi tiết Nội dung chuyển khoản có kèm mã SKU */}
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
        đơn hàng và mã SKU sản phẩm.
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
