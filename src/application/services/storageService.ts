function isAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function get<T>(key: string): T | null {
  if (!isAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (!isAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

function remove(key: string): void {
  if (!isAvailable()) return;
  window.localStorage.removeItem(key);
}

function clear(): void {
  if (!isAvailable()) return;
  window.localStorage.clear();
}

export const storageService = { get, set, remove, clear } as const;