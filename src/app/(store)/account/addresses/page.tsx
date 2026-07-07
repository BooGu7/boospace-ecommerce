"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MapPin, Plus, Trash2, ArrowRight } from "lucide-react";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Cấu hình Hoạt ảnh Spring dẹt mượt mà (Type-safe Variants)
const listContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const addressCardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 130, damping: 20 },
  },
  hover: {
    y: -4,
    borderColor: "#1E1C1A",
    boxShadow: "0 15px 30px -10px rgba(28, 28, 28, 0.06)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

export default function AddressesPage() {
  const { user, isReady } = useAuthGuard();
  const addAddress = useAuthStore((s) => s.addAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "VN", // Bản địa hóa mặc định về Việt Nam
  });

  if (!isReady) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addAddress({
      type: "shipping",
      firstName: form.firstName,
      lastName: form.lastName,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode || "100000",
      country: form.country,
      isDefault: (user?.addresses.length ?? 0) === 0,
    });
    toast.success("Đã bổ sung địa chỉ mới ✨");
    setShowForm(false);
    setForm({
      firstName: "",
      lastName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "VN",
    });
  }

  const addresses = user?.addresses ?? [];

  return (
    <div className="bg-[#FCFAF2] text-[#1E1C1A] min-h-screen antialiased selection:bg-[#EAE5D9]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-x border-[#E1DDD5] bg-[#FCFAF2]/50">
        {/* HEADER SECTION PHONG CÁCH TẠP CHÍ DẸT */}
        <div className="border-b border-[#E1DDD5] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#786F66] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DCD6CC] w-fit">
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              02 / SHIPPING DIRECTORY
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-serif leading-none">
              Địa chỉ giao hàng
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#786F66] uppercase tracking-wider">
              Quản lý danh sách sổ địa chỉ nhận hàng cá nhân của bạn
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-black hover:bg-[#33302C] text-white font-mono uppercase text-xs font-bold tracking-wider py-4 px-6 rounded-xl cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>

            <Link
              href="/account"
              className="text-xs font-mono text-[#786F66] hover:text-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              Quay lại <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* CONTAINER FORM THÊM ĐỊA CHỈ */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-3xl text-left mb-8 overflow-hidden"
            >
              <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-8 shadow-sm">
                <CardHeader className="p-0 pb-4 border-b border-[#E1DDD5]/40 mb-6">
                  <CardTitle className="font-serif text-lg font-bold text-black flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#786F66]" />
                    Địa chỉ nhận hàng mới
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  <form onSubmit={handleAdd} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                          Tên của bạn
                        </Label>
                        <Input
                          name="firstName"
                          placeholder="An"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                          Họ của bạn
                        </Label>
                        <Input
                          name="lastName"
                          placeholder="Nguyễn Văn"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                        Địa chỉ (Số nhà, tên đường...)
                      </Label>
                      <Input
                        name="line1"
                        placeholder="Ví dụ: 123 Đường Ba Tháng Hai, Phường 12"
                        value={form.line1}
                        onChange={handleChange}
                        required
                        className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                        Căn hộ, tòa nhà, phòng (không bắt buộc)
                      </Label>
                      <Input
                        name="line2"
                        placeholder="Ví dụ: Lô B, Phòng 402"
                        value={form.line2}
                        onChange={handleChange}
                        className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                          Quận / Huyện
                        </Label>
                        <Input
                          name="city"
                          placeholder="Quận 10"
                          value={form.city}
                          onChange={handleChange}
                          required
                          className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                          Tỉnh / Thành phố
                        </Label>
                        <Input
                          name="state"
                          placeholder="TP. Hồ Chí Minh"
                          value={form.state}
                          onChange={handleChange}
                          required
                          className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-mono font-bold text-[#5c544d] uppercase tracking-wider">
                          Mã bưu chính
                        </Label>
                        <Input
                          name="postalCode"
                          placeholder="700000"
                          value={form.postalCode}
                          onChange={handleChange}
                          className="rounded-xl border-[#CFCABF] focus:border-[#FF9D00] text-sm text-black font-sans font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        className="bg-[#FF9D00] hover:bg-[#E68A00] text-black font-mono uppercase text-xs font-bold tracking-wider py-4 px-6 rounded-xl cursor-pointer"
                      >
                        Lưu địa chỉ
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false); //  Chỉ giữ lại lệnh ẩn Form
                        }}
                        className="rounded-xl border-[#E1DDD5] font-mono uppercase text-xs font-bold tracking-wider py-4 px-6 cursor-pointer"
                      >
                        Huỷ bỏ
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {addresses.length === 0 && !showForm && (
          <EmptyState
            icon={MapPin}
            title="Chưa có địa chỉ nào được lưu"
            description="Hãy thêm địa chỉ giao hàng để thực hiện quy trình thanh toán nhanh hơn vào lần sau."
          />
        )}

        {/* DANH SÁCH ĐỊA CHỈ HIỆN CÓ ĐÃ ĐỒNG BỘ HOẠT ẢNH THÁC ĐỔ */}
        {addresses.length > 0 && (
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 text-left"
          >
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                variants={addressCardVariants}
                whileHover="hover"
                className="block"
              >
                <Card className="rounded-3xl border border-[#DCD6CC] bg-white p-6 flex flex-col justify-between min-h-[180px] shadow-sm relative transition-all">
                  <CardContent className="p-0 flex items-start justify-between h-full">
                    <div className="space-y-3.5 flex-1 min-w-0">
                      {/* Tên khách hàng & Tag Mặc định dẹt */}
                      <div className="flex items-center gap-2.5">
                        <p className="font-serif text-base font-bold text-black truncate">
                          {addr.lastName} {addr.firstName}
                        </p>
                        {addr.isDefault && (
                          <span className="text-[9px] font-mono font-bold text-[#FF9D00] bg-[#EAE5D9]/40 border border-[#DCD6CC] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Mặc định
                          </span>
                        )}
                      </div>

                      {/* Địa chỉ chi tiết */}
                      <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed font-sans font-medium">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}
                        <br />
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                    </div>

                    {/* Nút xóa địa chỉ dẹt */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeAddress(addr.id);
                        toast("Đã xoá địa chỉ");
                      }}
                      className="text-[#786F66] hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                      aria-label="Xoá địa chỉ"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
