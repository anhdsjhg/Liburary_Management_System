const BASE_URL =
  import.meta.env.VITE_APP_URL || "https://library.sdu.edu.kz/api";

export function buildBackendImageUrl(path?: string | null): string | null {
  if (!path) return null;

  // если уже полный URL — не трогаем
  if (path.startsWith("http")) return path;

  // убираем /api, чтобы не было двойного /api/images
  const base = BASE_URL.replace(/\/api$/, "");

  return `${base}${path}`;
}