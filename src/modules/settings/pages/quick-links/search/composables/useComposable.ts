import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuickLinkGetApi } from "@/api/settings/quick-links/get";
import { useQuickLinkDeleteApi } from "@/api/settings/quick-links/[id]/delete";
import type { QuickLink } from "@/api/settings/quick-links/get/types";
import type { TableColumnDef } from "@/application/types/table";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useQuickLinksSearch() {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useQuickLinkGetApi();
  const { mutate: deleteLink, isPending: deleteLoading } = useQuickLinkDeleteApi();

  const items = computed<QuickLink[]>(() => data.value?.res ?? []);

  const columns: TableColumnDef<QuickLink>[] = [
    { name: "settings.title_en", link: "title_en" },
    { name: "settings.title_ru", link: "title_ru" },
    { name: "settings.link", link: "link" },
  ];

  function onDelete(row: QuickLink) {
    deleteLink(row.id, {
      onSuccess() {
        showSuccessToast(t("settings.deleted"));
        refetch();
      },
      onError() {
        showErrorToast(t("settings.deleted"));
      },
    });
  }

  return { items, columns, isLoading, deleteLoading, refetch, onDelete };
}