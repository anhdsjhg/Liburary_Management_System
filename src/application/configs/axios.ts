import axios from "axios";
import { StorageKeys } from "./constants";

const axiosInstance = axios.create({
  baseURL: import.meta.env.APP_URL ?? "https://2b39-109-175-215-60.ngrok-free.app/api",
  timeout: 20_000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.params && typeof config.params === "object") {
      config.params = Object.fromEntries(
        Object.entries(config.params as Record<string, unknown>).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      );
    }

    const rawToken = localStorage.getItem(StorageKeys.TOKEN);
    const token = rawToken ? JSON.parse(rawToken) : null;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    const lang = getStoredLocale();
    config.headers["Content-Language"] = lang;

    return config;
  },
  (error) => Promise.reject(error)
);

function getStoredLocale(): string {
  try {
    const raw = localStorage.getItem(StorageKeys.LANG);
    return raw ? (JSON.parse(raw) as string) : "en";
  } catch {
    return "en";
  }
}

export default axiosInstance;