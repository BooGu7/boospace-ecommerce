"use client"

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center px-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">500</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Something went wrong
            </h1>
            <p className="mt-4 text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
