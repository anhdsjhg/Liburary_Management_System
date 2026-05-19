export function decodeHtml(html?: string | null): string {
  if (!html) return "";
  if (typeof document === "undefined") return html; // SSR fallback
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Strips all HTML tags from a string, returning plain text.
 * Safe against null/undefined input.
 *
 * @example
 * stripHtml("<p>Hello <strong>world</strong></p>")  // "Hello world"
 */
export function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Cleans up Quill editor <pre data-language="plain"> code blocks.
 * Decodes the inner HTML content, removing Quill wrapper markup.
 * Matches pattern from reference project cleanQuillCodeBlocks().
 *
 * @example
 * cleanQuillCodeBlocks('<pre data-language="plain">&lt;p&gt;Text&lt;/p&gt;</pre>')
 * // "<p>Text</p>"
 */
export function cleanQuillCodeBlocks(html?: string | null): string {
  if (!html) return "";
  return html.replace(
    /<pre[^>]*data-language="plain"[^>]*>([\s\S]*?)<\/pre>/g,
    (_, inner: string) => decodeHtml(inner)
  );
}

/**
 * Escapes a string for safe injection into HTML attributes or content.
 * Prevents XSS when inserting user-provided strings into HTML.
 *
 * @example
 * escapeHtml('<script>alert("xss")</script>')  // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Truncates HTML content to approximate plain-text length.
 * Strips tags first, then truncates. Useful for announcement previews.
 *
 * @example
 * truncateHtml("<p>Hello world</p>", 5)  // "Hello…"
 */
export function truncateHtml(html: string, maxLength: number, ellipsis = "…"): string {
  const plain = stripHtml(html);
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength) + ellipsis;
}