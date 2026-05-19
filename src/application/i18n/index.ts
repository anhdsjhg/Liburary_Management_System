import type { App } from "vue";
import { createI18n } from "vue-i18n";
import { i18nMessages, type Locale, type MessageSchema } from "./messages";

export const i18n = createI18n<[MessageSchema], Locale>({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: i18nMessages,
});

export function installVueI18n(app: App) {
  app.use(i18n);
}
