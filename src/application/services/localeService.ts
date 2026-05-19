import type { Composer } from "vue-i18n";
import axiosInstance from "../configs/axios";
import { storageService } from "./storageService";
import { StorageKeys, DEFAULT_LOCALE, LOCALES, type Locale } from "../configs/constants";

let _i18n: Composer | null = null;

function install(composer: Composer): void {
  _i18n = composer;
}

function getLocale(): Locale {
  if (_i18n) return _i18n.locale.value as Locale;

  const stored = storageService.get<Locale>(StorageKeys.LANG);
  return stored ?? DEFAULT_LOCALE;
}

function setLocale(locale: Locale): void {
  if (!LOCALES.includes(locale)) {
    console.warn(`[localeService] Unknown locale: "${locale}". Ignored.`);
    return;
  }

  if (_i18n) {
    _i18n.locale.value = locale;
  }

  axiosInstance.defaults.headers.common["Content-Language"] = locale;

  storageService.set(StorageKeys.LANG, locale);
}

function restoreLocale(): void {
  const stored = storageService.get<Locale>(StorageKeys.LANG);
  setLocale(stored ?? DEFAULT_LOCALE);
}

export const localeService = {
  install,
  getLocale,
  setLocale,
  restoreLocale,
} as const;