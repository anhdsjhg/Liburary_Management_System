import axios from "axios";
import type { Router } from "vue-router";
import { StorageKeys } from "./constants";

let _router: Router | null = null;
export function setAxiosRouter(router: Router) {
  _router = router;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL ?? "/api",
  timeout: 20_000,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 403 && _router) {
      _router.replace({ path: "/403" });
    }
    return Promise.reject(error);
  }
);

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