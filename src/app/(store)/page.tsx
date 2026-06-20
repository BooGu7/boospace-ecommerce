import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { productRepository, categoryRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Boospace — Custom 3D Printed Workspace & DIY Design Studio",

  description:
    "Boospace cung cấp sản phẩm in 3D theo yêu cầu cho workspace và DIY. Thiết kế tùy chỉnh, sản xuất theo ý tưởng riêng và tạo ra các giải pháp không gian làm việc độc đáo bằng công nghệ in 3D.",

  alternates: {
    canonical: "https://boospace.tech/",
  },

  openGraph: {
    title: "Boospace — Custom 3D Printed Workspace",
    description:
      "Thiết kế và sản xuất sản phẩm in 3D cho workspace và DIY theo yêu cầu tại Boospace.",
    type: "website",
    url: "https://boospace.tech/",
  },

  keywords: [
    "3d printed workspace",
    "custom 3d print",
    "3d printing service",
    "workspace accessories",
    "custom desk setup",
    "diy 3d print",
    "boospace",
    "boospace tech",
  ],
};
export default async function HomePage() {
  const categories = await categoryRepository.list();
  const featuredProducts = await productRepository.getFeatured(4);

  return (
    <div className="flex flex-col">
      {/* Sau này bổ sung Banner ở đây */}
      {/* Hero */}
      {/* <section className="relative flex h-[650px] items-center justify-center bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Free shipping on orders over {formatPrice(siteConfig.freeShippingThreshold)}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Next.js Ecommerce Starter
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            A free, open-source ecommerce template built with Next.js, Tailwind CSS, and shadcn/ui.
            Production-ready, fully responsive, and designed to connect to any checkout system.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/Epic-Design-Labs/nextjs-ecommerce-starter" target="_blank" rel="noopener">
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Sản phẩm nổi bật
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Danh mục</h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={category.image?.url ?? PLACEHOLDER_IMAGE}
                  alt={category.image?.alt ?? category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-medium group-hover:underline">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Developer CTA */}
      <section className="border-t bg-neutral-50">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Bạn có ý tưởng muốn biến thành sản phẩm? ✨
          </h2>

          <p className="mt-4 max-w-xl text-muted-foreground">
            Từ những ý tưởng DIY, đồ vật bị hỏng cần “cứu”, đến sản phẩm in 3D
            độc đáo — chúng tôi giúp bạn thiết kế và hiện thực hóa mọi thứ theo
            cách bạn muốn.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/contact">
                Gửi ý tưởng ngay 💌
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-neutral-900 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Đăng ký nhận tin ✨
          </h2>
          <p className="mt-4 text-neutral-400">
            Cập nhật các sản phẩm mới và ưu đãi đặc biệt dành riêng cho bạn.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
