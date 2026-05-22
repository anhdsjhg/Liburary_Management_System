import { computed, ref } from "vue";
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

  const deleteTarget = ref<QuickLink | null>(null);
  const deleteConfirmVisible = ref(false);

  function requestDelete(row: QuickLink) {
    deleteTarget.value = row;
    deleteConfirmVisible.value = true;
  }

  function confirmDelete() {
    if (!deleteTarget.value) return;
    deleteLink(deleteTarget.value.id, {
      onSuccess() {
        showSuccessToast(t("settings.deleted"));
        deleteTarget.value = null;
        refetch();
      },
      onError() {
        showErrorToast(t("settings.error"));
        deleteTarget.value = null;
      },
    });
  }

  function doDelete(row: QuickLink) {
    deleteLink(row.id, {
      onSuccess() {
        showSuccessToast(t("settings.deleted"));
        refetch();
      },
      onError() {
        showErrorToast(t("settings.error"));
      },
    });
  }

  return { items, columns, isLoading, deleteLoading, deleteConfirmVisible, refetch, requestDelete, confirmDelete, doDelete };
}
