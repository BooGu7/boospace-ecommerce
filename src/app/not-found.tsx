import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { categoryRepository } from "@/lib/repositories";

export default async function NotFound() {
  // Fetch categories so the header nav still works on 404
  const categories = await categoryRepository.list();

  return (
    <>
      <AnnouncementBar />
      {/* <Header categories={categories} /> */}
      <main className="flex-1">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">404</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Ối… không tìm thấy trang rồi
          </h1>

          <p className="mt-4 text-muted-foreground max-w-md">
            Trang bạn tìm có vẻ đã “đi lạc” đâu đó mất rồi. Bạn thử quay lại
            trang chủ hoặc khám phá thêm những sản phẩm dễ thương khác nhé ✨
          </p>

          <div className="mt-8 flex gap-4">
            <Button asChild>
              <Link href="/">Về nhà thôi</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/shop">Xem tiếp sản phẩm</Link>
            </Button>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
