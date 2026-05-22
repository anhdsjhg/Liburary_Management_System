import { useI18n } from "vue-i18n";
import { useArrivalCreateApi } from "@/api/settings/arrivals/post";
import { useArrivalForm } from "./useFormComposable";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useArrivalManageDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { mutate: create, isPending: isCreating } = useArrivalCreateApi();
  const { form, reset } = useArrivalForm();

  function save() {
    create(
      { inv_id: form.inv_id, image_url: form.image_url || undefined },
      {
        onSuccess() {
          showSuccessToast(t("settings.created"));
          reset();
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("settings.error"));
        },
      }
    );
  }

  return { form, isCreating, save, reset };
}