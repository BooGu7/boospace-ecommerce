"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";

import { supabase } from "@/lib/supabase/client";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAuthStore } from "@/store/auth";

import { toast } from "sonner";

export default function SettingsPage() {
  const { user, isReady } = useAuthGuard();

  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
  }, [user]);

  if (!isReady) {
    return null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Không tìm thấy tài khoản");
      return;
    }

    try {
      setSavingProfile(true);

      const normalizedEmail = email.trim().toLowerCase();

      const normalizedFirstName = firstName.trim();

      const normalizedLastName = lastName.trim();

      const { data: existingUser, error: emailCheckError } = await supabase
        .from("ecommerce_users")
        .select("id")
        .eq("email", normalizedEmail)
        .neq("id", user.id)
        .maybeSingle();

      if (emailCheckError) {
        throw emailCheckError;
      }

      if (existingUser) {
        toast.error("Email đã được sử dụng");
        return;
      }

      const { data: dbUser, error: loadError } = await supabase
        .from("ecommerce_users")
        .select("data")
        .eq("id", user.id)
        .single();

      if (loadError) {
        throw loadError;
      }

      const updatedData = {
        ...(dbUser?.data ?? {}),
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        updatedAt: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("ecommerce_users")
        .update({
          email: normalizedEmail,
          data: updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      updateProfile({
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
      });

      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật hồ sơ",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader title="Thiết lập" />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Tên</Label>

                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Họ</Label>

                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={savingProfile}>
              {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />
    </div>
  );
}
