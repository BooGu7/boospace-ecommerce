import * as React from "react";
import { Check, Sparkles } from "lucide-react";

interface Props {
  text?: string;
}

export function FormattedDescription({ text }: Props) {
  if (!text || text.trim() === "") return null;

  // 1. Nếu chuỗi đã chứa mã HTML sẵn -> Render an toàn
  const isHtml = /<[a-z][\s\S]*>/i.test(text);
  if (isHtml) {
    return (
      <div
        className="blog-body prose prose-stone max-w-none text-[#1E1C1A] text-sm sm:text-base leading-relaxed space-y-4 text-left font-sans"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  // 2. Bộ phân tích Markdown & Văn bản cấu trúc thông minh
  // Tách văn bản theo từng đoạn xuống dòng
  const rawParagraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Helper chuyển đổi **in đậm** trong câu thành thẻ <strong>
  const parseInlineMarkdown = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
    return parts.map((part, i) => {
      if (
        (part.startsWith("**") && part.endsWith("**")) ||
        (part.startsWith("__") && part.endsWith("__"))
      ) {
        return (
          <strong key={i} className="font-bold text-black font-serif">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 text-left font-sans text-sm sm:text-base leading-relaxed text-[#5C564E]">
      {rawParagraphs.map((para, pIdx) => {
        const lines = para
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        // Kiểm tra nếu đoạn văn là danh sách các mục phân loại (chứa dấu hai chấm : hoặc gạch đầu dòng - )
        const hasListItems = lines.some(
          (l) =>
            l.includes(":") ||
            l.startsWith("-") ||
            l.startsWith("*") ||
            l.startsWith("•"),
        );

        if (hasListItems) {
          return (
            <div key={pIdx} className="space-y-3">
              {lines.map((line, lIdx) => {
                // Tiêu đề nhóm (VD: The 4 Frame Models, 🪵 The 2 Faceplates)
                const isHeading =
                  line.startsWith("#") ||
                  line.startsWith("🪵") ||
                  line.startsWith("⚙️") ||
                  line.includes("Models") ||
                  line.includes("Faceplates") ||
                  line.includes("Series") ||
                  (!line.includes(":") && lIdx === 0);

                if (
                  isHeading &&
                  !line.startsWith("-") &&
                  !line.startsWith("•")
                ) {
                  const cleanHeading = line
                    .replace(/^#+\s*/, "")
                    .replace(/:$/, "");
                  return (
                    <div
                      key={lIdx}
                      className="pt-2 pb-1 border-b border-[#E1DDD5]"
                    >
                      <h4 className="font-serif text-base sm:text-lg font-bold text-black flex items-center gap-2">
                        <Sparkles className="size-4 text-[#FF9D00] shrink-0" />
                        {cleanHeading}
                      </h4>
                    </div>
                  );
                }

                // Dòng chi tiết phân loại có dấu hai chấm (VD: Frame_Organic_Open: Dynamic edge...)
                if (line.includes(":")) {
                  const colonIndex = line.indexOf(":");
                  const title = line
                    .substring(0, colonIndex)
                    .replace(/^[-*•]\s*/, "")
                    .trim();
                  const desc = line.substring(colonIndex + 1).trim();

                  return (
                    <div
                      key={lIdx}
                      className="p-3.5 rounded-2xl bg-[#FAF5F2]/90 border border-[#E1DDD5] space-y-1 hover:border-[#FF9D00]/40 transition-colors"
                    >
                      <div className="font-mono text-xs sm:text-sm font-bold text-black flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-[#FF9D00] shrink-0" />
                        {title}
                      </div>
                      {desc && (
                        <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed pl-3 font-normal">
                          {parseInlineMarkdown(desc)}
                        </p>
                      )}
                    </div>
                  );
                }

                // Dòng gạch đầu dòng bullet thông thường
                if (
                  line.startsWith("-") ||
                  line.startsWith("*") ||
                  line.startsWith("•")
                ) {
                  const cleanLine = line.replace(/^[-*•]\s*/, "").trim();
                  return (
                    <div
                      key={lIdx}
                      className="flex items-start gap-2.5 pl-2 text-xs sm:text-sm"
                    >
                      <Check className="size-3.5 text-[#3ECF8E] shrink-0 mt-1" />
                      <p className="leading-relaxed">
                        {parseInlineMarkdown(cleanLine)}
                      </p>
                    </div>
                  );
                }

                return (
                  <p key={lIdx} className="text-xs sm:text-sm leading-relaxed">
                    {parseInlineMarkdown(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        // Đoạn văn thông thường có hỗ trợ **in đậm**
        return (
          <p key={pIdx} className="text-xs sm:text-sm leading-relaxed">
            {parseInlineMarkdown(para)}
          </p>
        );
      })}
    </div>
  );
}
