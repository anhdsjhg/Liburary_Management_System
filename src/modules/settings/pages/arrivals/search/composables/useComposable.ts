import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useArrivalGetApi } from "@/api/settings/arrivals/get";
import { useArrivalDeleteApi } from "@/api/settings/arrivals/[id]/delete";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";
import type { TableColumnDef } from "@/application/types/table";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useArrivalsSearch() {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useArrivalGetApi();
  const { mutate: deleteArrival, isPending: deleteLoading } = useArrivalDeleteApi();

  const items = computed<ArrivalItem[]>(() => data.value?.res ?? []);

  const columns: TableColumnDef<ArrivalItem>[] = [
    { name: "settings.book_title", link: "title" },
    { name: "settings.author", link: "author" },
    { name: "settings.year", link: "year" },
    { name: "settings.isbn", link: "isbn" },
    { name: "settings.inv_id", link: "inv_id" },
  ];

  const deleteTarget = ref<ArrivalItem | null>(null);
  const deleteConfirmVisible = ref(false);

  function requestDelete(item: ArrivalItem) {
    deleteTarget.value = item;
    deleteConfirmVisible.value = true;
  }

  function confirmDelete() {
    if (!deleteTarget.value) return;
    deleteArrival(
      { type: deleteTarget.value.type_key, id: deleteTarget.value.id },
      {
        onSuccess() {
          showSuccessToast(t("settings.deleted"));
          deleteTarget.value = null;
          refetch();
        },
        onError() {
          showErrorToast(t("settings.error"));
          deleteTarget.value = null;
        },
      }
    );
  }

  return {
    items,
    columns,
    isLoading,
    deleteLoading,
    deleteConfirmVisible,
    refetch,
    requestDelete,
    confirmDelete,
  };
}
