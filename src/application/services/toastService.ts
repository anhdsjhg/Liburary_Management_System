import type { App } from "vue";
import { useToast } from "primevue/usetoast";
import { toastSuccessLifeTime, toastErrorLifeTime } from "../configs/constants";
import type { ToastServiceMethods } from "primevue/toastservice";

let _toast: ToastServiceMethods | null = null;

export let globalToast: ToastServiceMethods | null = null;

export function setGlobalToast(toast: ToastServiceMethods) {
  globalToast = toast;
}

export function installToastService(app: App): void {
  const instance = app.config.globalProperties.$toast as ToastServiceMethods;
  if (!instance) {
    console.warn("[toastService] PrimeVue Toast not found. Did you install ToastService?");
    return;
  }
  _toast = instance;
}

export function installToastServiceFromComposable(): void {
  try {
    globalToast = useToast();
    _toast = globalToast;
  } catch {
  }
}

export function showSuccessToast(detail: string, summary?: string): void {
  if (!_toast) return;
  _toast.add({
    severity: "success",
    summary: summary ?? "Success",
    detail,
    life: toastSuccessLifeTime,
  });
}

export function showErrorToast(detail: string, summary?: string): void {
  if (!_toast) return;
  _toast.add({
    severity: "error",
    summary: summary ?? "Error",
    detail,
    life: toastErrorLifeTime,
  });
}

export function showInfoToast(detail: string, summary?: string): void {
  if (!_toast) return;
  _toast.add({
    severity: "info",
    summary: summary ?? "Info",
    detail,
    life: toastSuccessLifeTime,
  });
}

export function showWarnToast(detail: string, summary?: string): void {
  if (!_toast) return;
  _toast.add({
    severity: "warn",
    summary: summary ?? "Warning",
    detail,
    life: toastErrorLifeTime,
  });
}