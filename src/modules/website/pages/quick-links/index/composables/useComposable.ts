import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuickLinkGetApi } from "@/api/settings/quick-links/get";
import type { QuickLink } from "@/api/settings/quick-links/get/types";

export function useQuickLinks() {
  const { locale } = useI18n();

  const { data, isLoading } = useQuickLinkGetApi();

  const quickLinks = computed<QuickLink[]>(() => data.value?.res ?? []);

  function getTitle(item: QuickLink): string {
    const lang = locale.value as "en" | "ru" | "kz";
    return item[`title_${lang}`] ?? item.title_en ?? "";
  }

  function getDescription(item: QuickLink): string {
    const lang = locale.value as "en" | "ru" | "kz";
    return item[`description_${lang}`] ?? item.description_en ?? "";
  }

  return {
    quickLinks,
    isLoading,
    getTitle,
    getDescription,
  };
}