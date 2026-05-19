export const locales = ["en", "ru", "kz"] as const;
export type Locale = (typeof locales)[number];

export const uppercaseLocale = {
  EN: "EN",
  RU: "RU",
  KZ: "KZ",
} as const;

export type UppercaseLocale =
  (typeof uppercaseLocale)[keyof typeof uppercaseLocale];
