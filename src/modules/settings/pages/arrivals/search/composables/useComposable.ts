import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useArrivalGetApi } from "@/api/settings/arrivals/get";
import { useArrivalDeleteApi } from "@/api/settings/arrivals/[id]/delete";
import type { ArrivalItem } from "@/api/settings/arrivals/get/types";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useArrivalsSearch() {
  const { t } = useI18n();

  const { data, isLoading, refetch } = useArrivalGetApi();
  const { mutate: deleteArrival, isPending: deleteLoading } = useArrivalDeleteApi();

  const addInvId = ref("");
  const addLoading = ref(false);

  function onDelete(item: ArrivalItem) {
    deleteArrival(
      { type: item.type_key, id: item.id },
      {
        onSuccess() {
          showSuccessToast(t("settings.deleted"));
          refetch();
        },
        onError() {
          showErrorToast(t("settings.deleted"));
        },
      }
    );
  }

  return {
    items: data,
    isLoading,
    deleteLoading,
    addInvId,
    addLoading,
    refetch,
    onDelete,
  };
}