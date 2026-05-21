import { computed } from "vue";
import type { ComputedRef } from "vue";
import { i18n } from "../i18n";
import type { Locale } from "../configs/constants";
import { capitalizeString } from "./string";

export function lt(
  property: string,
  object?: Record<string, unknown> | null,
  lang?: Locale
): ComputedRef<string> {
  return computed(() => {
    const locale = lang ?? (i18n.global.locale as Locale);
    const key = `${property}_${locale}`;

    if (!object) return "";

    return (
      (object[key] as string | undefined) ??
      (object[`${property}_en`] as string | undefined) ??
      (object[`${property}_kz`] as string | undefined) ??
      (object[`${property}_ru`] as string | undefined) ??
      ""
    );
  });
}

export function ltCamel(
  property: string,
  object?: Record<string, unknown> | null,
  lang?: Locale
): ComputedRef<string> {
  return computed(() => {
    const locale = lang ?? (i18n.global.locale as Locale);
    const key = `${property}${capitalizeString(locale)}`;

    if (!object) return "";

    return (
      (object[key] as string | undefined) ??
      (object[`${property}En`] as string | undefined) ??
      (object[`${property}Kz`] as string | undefined) ??
      (object[`${property}Ru`] as string | undefined) ??
      ""
    );
  });
}

export function lk<TBase extends string>(
  base: TBase,
  locale?: Locale
): ComputedRef<`${TBase}${Capitalize<Locale>}`> {
  return computed(() => {
    const lang = (locale ?? (i18n.global.locale as Locale)) as Locale;
    const capitalized = capitalizeString(lang);
    return `${base}${capitalized}` as `${TBase}${Capitalize<Locale>}`;
  });
}

export function getLocalizedKey<TBase extends string>(
  base: TBase,
  locale?: Locale
): string {
  const lang = locale ?? (i18n.global.locale as Locale);
  return `${base}${capitalizeString(lang)}`;
}