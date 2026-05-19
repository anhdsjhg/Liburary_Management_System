import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAnnouncementSearchApi } from "@/api/settings/announcements/post";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";
import type { AnnouncementSearchResponse } from "@/api/settings/announcements/post/types";
import type { PaginationMeta } from "@/application/types/table";

interface EventFilter {
  start_date: { from: string; to: string };
  end_date: { to: string };
}

interface EventSearchResult {
  data: AnnouncementItem[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export function useEventsSearch() {
  const { locale } = useI18n();

  const { mutate, isPending: isLoading } = useAnnouncementSearchApi();

  const currentPage = ref(1);

  const results = ref<EventSearchResult>({
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const filter = reactive<EventFilter>({
    start_date: { from: "", to: "" },
    end_date: { to: "" },
  });

  const paginationMeta = computed<PaginationMeta>(() => ({
    total: results.value.total,
    from: (results.value.current_page - 1) * results.value.per_page + 1,
    to: Math.min(
      results.value.current_page * results.value.per_page,
      results.value.total
    ),
    current_page: results.value.current_page,
    last_page: results.value.last_page,
    per_page: results.value.per_page,
  }));

  const hasPagination = computed(
    () => results.value.total > results.value.per_page
  );

  function buildAddOptions() {
    const options: Array<{
      key: string;
      value: Record<string, string> | string;
    }> = [];

    if (filter.start_date.from || filter.start_date.to) {
      options.push({
        key: "start_date",
        value: { from: filter.start_date.from, to: filter.start_date.to },
      });
    }

    if (filter.end_date.to) {
      options.push({
        key: "end_date",
        value: { to: filter.end_date.to },
      });
    }

    return options;
  }

  function search(page = 1) {
    currentPage.value = page;

    mutate(
      {
        add_options: buildAddOptions(),
        order: { key: "start_date", mode: "desc" },
        page,
        per_page: 10,
      },
      {
        onSuccess(data: AnnouncementSearchResponse) {
          results.value = data.res;
        },
      }
    );
  }

  function applyFilter() {
    search(1);
  }

  function resetFilter() {
    filter.start_date = { from: "", to: "" };
    filter.end_date = { to: "" };
    search(1);
  }

  function onPageChange(page: number) {
    search(page);
  }

  function getLocalizedTitle(item: AnnouncementItem): string {
    const lang = locale.value as "en" | "ru" | "kz";
    return item[`title_${lang}`] ?? item.title_en ?? "";
  }

  function getLocalizedPlace(item: AnnouncementItem): string {
    const lang = locale.value as "en" | "ru" | "kz";
    return item[`place_${lang}`] ?? item.place_en ?? "";
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return {
    filter,
    results,
    isLoading,
    paginationMeta,
    hasPagination,
    currentPage,
    search,
    applyFilter,
    resetFilter,
    onPageChange,
    getLocalizedTitle,
    getLocalizedPlace,
    formatDate,
  };
}