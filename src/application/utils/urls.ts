const BASE_URL = "https://library.sdu.edu.kz";

export function buildBackendImageUrl(path?: string | null): string | null {
  if (!path) return null;

  if (path.startsWith("http")) return path;

  const base = BASE_URL.replace(/\/api$/, "");

  return `${base}${path}`;
}