import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAnnouncementShowApi } from "@/api/settings/announcements/[id]/get";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";

export function useEventDetail() {
  const route = useRoute();
  const { locale } = useI18n();

  const id = computed(() => Number(route.params.id));

  const { data, isLoading } = useAnnouncementShowApi(id);

  const announcement = computed<AnnouncementItem | null>(
    () => data.value?.res?.[0] ?? null
  );

  const title = computed(() => {
    if (!announcement.value) return "";
    const lang = locale.value as "en" | "ru" | "kz";
    return announcement.value[`title_${lang}`] ?? announcement.value.title_en ?? "";
  });

  const place = computed(() => {
    if (!announcement.value) return "";
    const lang = locale.value as "en" | "ru" | "kz";
    return announcement.value[`place_${lang}`] ?? announcement.value.place_en ?? "";
  });

  const description = computed(() => {
    if (!announcement.value) return "";
    const lang = locale.value as "en" | "ru" | "kz";
    return announcement.value[`description_${lang}`] ?? announcement.value.description_en ?? "";
  });

  const startDate = computed(() =>
    announcement.value?.start_date
      ? new Date(announcement.value.start_date)
      : null
  );

  const endDate = computed(() =>
    announcement.value?.end_date
      ? new Date(announcement.value.end_date)
      : null
  );

  function formatDate(date: Date): string {
    return date.toLocaleDateString(locale.value, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return {
    announcement,
    isLoading,
    title,
    place,
    description,
    startDate,
    endDate,
    formatDate,
  };
}