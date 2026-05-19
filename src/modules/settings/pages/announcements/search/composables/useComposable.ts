import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAnnouncementSearchApi } from "@/api/settings/announcements/post";
import { useAnnouncementDeleteApi } from "@/api/settings/announcements/[id]/delete";
import type { AnnouncementItem } from "@/api/settings/announcements/get/types";
import type { PaginationMeta, TableColumnDef } from "@/application/types/table";
import { RouteNames } from "@/application/router/routeNames";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useAnnouncementsSearch() {
  const router = useRouter();
  const { t } = useI18n();

  const { mutate: search, isPending: isLoading } = useAnnouncementSearchApi();
  const { mutate: deleteAnnouncement, isPending: deleteLoading } = useAnnouncementDeleteApi();

  const searchQuery = ref("");
  const currentPage = ref(1);

  const results = ref<{
    data: AnnouncementItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }>({
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const meta = computed<PaginationMeta>(() => ({
    total: results.value.total,
    from: (results.value.current_page - 1) * results.value.per_page + 1,
    to: Math.min(results.value.current_page * results.value.per_page, results.value.total),
    current_page: results.value.current_page,
    last_page: results.value.last_page,
    per_page: results.value.per_page,
  }));

  const columns: TableColumnDef<AnnouncementItem>[] = [
    { name: "settings.title_en", link: "title_en" },
    { name: "settings.start_date", link: "start_date" },
    { name: "settings.end_date", link: "end_date" },
    { name: "settings.type", link: "type" },
  ];

  function load(page = 1) {
    currentPage.value = page;
    search(
      {
        add_options: searchQuery.value.trim()
          ? [{ key: "all", value: searchQuery.value.trim() }]
          : [],
        page,
        per_page: 10,
      },
      {
        onSuccess(data) {
          results.value = data.res;
        },
      }
    );
  }

  function onPageChange(page: number) {
    load(page);
  }

  function goToManage(row?: AnnouncementItem) {
    router.push({
      name: RouteNames.SETTINGS_ANNOUNCEMENTS_MANAGE,
      params: row ? { id: row.announcement_id } : {},
    });
  }

  function onDelete(row: AnnouncementItem) {
    deleteAnnouncement(row.announcement_id, {
      onSuccess() {
        showSuccessToast(t("settings.deleted"));
        load(currentPage.value);
      },
      onError() {
        showErrorToast(t("settings.deleted"));
      },
    });
  }

  return {
    searchQuery,
    columns,
    results,
    meta,
    isLoading,
    deleteLoading,
    currentPage,
    load,
    onPageChange,
    goToManage,
    onDelete,
  };
}