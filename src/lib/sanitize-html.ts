/**
 * BỘ LỌC BẢO MẬT & XỬ LÝ VIDEO/IFRAME NATIVE (ZERO-DEPENDENCY)
 * Khắc phục triệt để lỗi ERR_REQUIRE_ESM (jsdom crash) trên Vercel Serverless.
 */

// Danh sách các thẻ an toàn được phép hiển thị
const ALLOWED_TAGS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "b",
  "i",
  "strong",
  "em",
  "u",
  "strike",
  "blockquote",
  "pre",
  "code",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "figure",
  "figcaption",
  "div",
  "span",
  "br",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "iframe",
  "video",
  "source",
]);

/**
 * LÀM SẠCH MÃ HTML & TỰ ĐỘNG CHUẨN HÓA VIDEO/IFRAME
 */
export function sanitizeBlogContent(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";

  let html = dirtyHtml;

  // 1. Loại bỏ các thẻ độc hại (XSS Vectors)
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  html = html.replace(/<link\b[^>]*>/gi, "");
  html = html.replace(
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    "",
  );
  html = html.replace(/<embed\b[^>]*>/gi, "");

  // 2. Loại bỏ các sự kiện nguy hiểm (on*=) và javascript: URL
  html = html.replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(
    /href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi,
    'href="#"',
  );
  html = html.replace(
    /src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi,
    "",
  );

  // 3. Sửa và chuyển đổi thông minh các link YouTube (watch, shorts, youtu.be) sang youtube-nocookie embed
  html = html.replace(
    /<iframe\s+([^>]*?)src=["'](https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^"'\s?&]+)[^"']*)["']([^>]*?)>/gi,
    (_match, pre, _fullUrl, videoId, post) => {
      const cleanId = videoId.replace(/^v\//, "").split("&")[0];
      const embedSrc = `https://www.youtube-nocookie.com/embed/${cleanId}`;
      return `<iframe ${pre}src="${embedSrc}" title="YouTube Video" class="size-full border-0 rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen${post}>`;
    },
  );

  // 4. Bọc iframe YouTube vào khung 16:9, trừ khi nội dung đã có wrapper tương tự.
  const youtubeIframePattern =
    /<iframe\b[^>]*\bsrc=["']https:\/\/www\.youtube-nocookie\.com\/embed\/[^"']+["'][^>]*>[\s\S]*?<\/iframe>/gi;
  html = html.replace(youtubeIframePattern, (iframe, offset, source) => {
    const parentOpen = source.lastIndexOf("<div", offset);
    const parentClose = source.lastIndexOf("</div>", offset);
    const parentTagEnd = parentOpen >= 0 ? source.indexOf(">", parentOpen) : -1;
    const alreadyWrapped =
      parentOpen > parentClose &&
      parentTagEnd >= 0 &&
      /\bclass=["'][^"']*\baspect-video\b[^"']*["']/i.test(
        source.slice(parentOpen, parentTagEnd + 1),
      );

    return alreadyWrapped
      ? iframe
      : `<div class="aspect-video w-full my-6 rounded-2xl overflow-hidden shadow-md border border-stone-200 bg-black">${iframe}</div>`;
  });

  // 5. Chỉ xóa iframe có src rỗng, không xóa iframe YouTube hợp lệ.
  html = html.replace(
    /<iframe\b[^>]*\bsrc\s*=\s*(?:"\s*"|'\s*')[^>]*>\s*<\/iframe>/gi,
    "",
  );

  // 6. Xóa các thẻ không nằm trong whitelist cho phép
  html = html.replace(
    /<\/?([a-z0-9-]+)(?:\s+[^>]*?)?>/gi,
    (fullTag, tagName) => {
      const lowerTag = tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(lowerTag)) {
        return "";
      }
      return fullTag;
    },
  );

  return html;
}
