// utils/imageUrl.js
export function getFullImageUrl(url) {
  if (!url) return "";
  // Already absolute
  if (url.startsWith("http")) return url;
  // Else, prefix your backend URL (set via env)
  const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000";
  return `${BASE}${url}`;
}
