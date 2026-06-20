"use client";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center px-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">500</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Hệ thống đang gặp chút vấn đề
            </h1>

            <p className="mt-4 text-muted-foreground max-w-md">
              Xin lỗi bạn, có vẻ như chúng tôi đang gặp trục trặc nhỏ ở phía máy
              chủ. Bạn thử tải lại trang sau ít phút nhé — mọi thứ sẽ sớm ổn
              thôi ✨
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
