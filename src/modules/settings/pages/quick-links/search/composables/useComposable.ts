import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuickLinkGetApi } from "@/api/settings/quick-links/get";
import { useQuickLinkDeleteApi } from "@/api/settings/quick-links/[id]/delete";
import type { QuickLink } from "@/api/settings/quick-links/get/types";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useQuickLinksSearch() {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useQuickLinkGetApi();
  const { mutate: deleteLink, isPending: deleteLoading } = useQuickLinkDeleteApi();

  const items = computed<QuickLink[]>(() => data.value?.res ?? []);

  function onDelete(row: QuickLink) {
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

  return { items, isLoading, deleteLoading, refetch, onDelete };
}
