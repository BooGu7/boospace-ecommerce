"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { motion, Variants } from "framer-motion";

const popularSearches = [
  "Workspace",
  "DIY Studio",
  "Mechanical",
  "Solid Wood",
  "Custom Design",
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: any[];
}

// Cấu hình Hoạt ảnh chuyển động mượt mà dẹp ngang (Type-safe Variants)
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: -30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 24, stiffness: 320 },
  },
};

const resultsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const resultItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 20 },
  },
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setQuery("");
    setProducts([]);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (query.trim() === "") {
      setProducts([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Tìm kiếm lỗi:", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[10vh] px-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Khung Modal chính trượt lò xo */}
      <motion.div
        ref={modalRef}
        variants={modalVariants}
        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl border border-[#E1DDD5]"
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        {/* Input Header */}
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập tên sản phẩm cần tìm bằng AI..."
            className="flex-1 border-0 bg-transparent px-4 py-4 text-base font-sans outline-none placeholder:text-muted-foreground/60 text-black"
          />
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-[#FF9D00] mr-2" />
          )}
          {hasQuery ? (
            <button
              onClick={() => setQuery("")}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded border bg-neutral-100 px-1.5 py-0.5 text-xs text-muted-foreground sm:inline font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Khu vực kết quả tìm kiếm */}
        <div className="max-h-[60vh] overflow-y-auto">
          {hasQuery && products.length > 0 && (
            <motion.div
              variants={resultsContainerVariants}
              initial="hidden"
              animate="visible"
              className="p-2 space-y-1"
            >
              {products.map((product) => {
                const imgUrl =
                  typeof product.images?.[0] === "string"
                    ? product.images[0]
                    : (product.images?.[0]?.url ?? PLACEHOLDER_IMAGE);

                const imgAlt =
                  typeof product.images?.[0] === "string"
                    ? product.name
                    : (product.images?.[0]?.alt ?? product.name);

                return (
                  <motion.div
                    key={product.id}
                    variants={resultItemVariants}
                    whileHover={{
                      x: 6,
                      backgroundColor: "rgba(234, 229, 217, 0.3)",
                    }}
                    className="rounded-lg transition-colors"
                  >
                    <Link
                      href={`/${product.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 p-3"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-100 border border-[#E1DDD5]">
                        <Image
                          src={imgUrl}
                          alt={imgAlt}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate font-sans">
                          {product.name}
                        </p>
                      </div>

                      {/* ĐỊNH DẠNG ĐÚNG ĐƠN VỊ TIỀN TỆ (VND) KHÔNG BỊ CHIA 100 CHUẨN XÁC */}
                      <span className="shrink-0 text-sm font-mono font-medium text-black">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleClose}
                className="mt-1 flex items-center justify-center gap-2 rounded-lg p-3 text-sm text-muted-foreground transition-colors hover:bg-neutral-50 hover:text-foreground font-sans"
              >
                Tất cả kết quả tìm kiếm
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          )}

          {hasQuery && products.length === 0 && !loading && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground font-sans animate-pulse">
                Không có kết quả nào phù hợp với &quot;{query}&quot;
              </p>
            </div>
          )}

          {!hasQuery && (
            <div className="p-4">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Sản phẩm được tìm kiếm nhiều
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <motion.button
                    key={term}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-[#E1DDD5] px-3 py-1.5 text-xs font-mono transition-colors hover:border-foreground hover:bg-neutral-50 text-black bg-white cursor-pointer"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
