import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Kiểm tra giỏ hàng của bạn.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
