import DOMPurify from "isomorphic-dompurify";

/**
 * BỘ LỌC BẢO MẬT CHO PHÉP HIỂN THỊ VIDEO YOUTUBE, SUPABASE MP4 & IFRAME
 */
export function sanitizeBlogContent(dirtyHtml: string): string {
  if (!dirtyHtml) return "";

  // 1. Tự động chuyển đổi các link YouTube dạng iframe cũ/rút gọn sang youtube-nocookie embed
  let preprocessed = dirtyHtml.replace(
    /<iframe\s+([^>]*?)src=["'](https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^"'\s?&]+)[^"']*)["']([^>]*?)>/gi,
    (_match, pre, _fullUrl, videoId, post) => {
      const cleanId = videoId.replace(/^v\//, "");
      const embedSrc = `https://www.youtube-nocookie.com/embed/${cleanId}`;
      return `<iframe ${pre}src="${embedSrc}" class="size-full border-0 rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen${post}>`;
    },
  );

  // 2. Tự động bọc video/iframe vào khung aspect-video nếu chưa có
  preprocessed = preprocessed.replace(
    /<iframe\s+src=["'](https:\/\/www\.youtube-nocookie\.com\/embed\/[^"']+)["']([^>]*)><\/iframe>/gi,
    (match) => {
      if (preprocessed.includes("aspect-video")) return match;
      return `<div class="aspect-video w-full my-6 rounded-2xl overflow-hidden shadow-md border border-stone-200 bg-black">${match}</div>`;
    },
  );

  // 3. Cấu hình Whitelist cho phép các thẻ Video, Iframe, Source an toàn
  return DOMPurify.sanitize(preprocessed, {
    ADD_TAGS: [
      "iframe",
      "video",
      "source",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "blockquote",
      "code",
      "pre",
    ],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "controls",
      "playsinline",
      "preload",
      "autoplay",
      "muted",
      "loop",
      "target",
      "rel",
      "src",
      "alt",
      "title",
      "class",
      "style",
    ],
  });
}
