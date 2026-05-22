import { useI18n } from "vue-i18n";
import { useServiceGiveApi } from "@/api/service-desk/actions/give/post";
import { useServiceReturnApi } from "@/api/service-desk/actions/return/post";
import { useAuthStore } from "@/application/stores/auth.store";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useActionForm } from "./useFormComposable";

export function useActionsPanel(onSuccess?: () => void) {
  const { t } = useI18n();
  const authStore = useAuthStore();
  const { form, reset } = useActionForm();
  const { mutate: give, isPending: isGiving } = useServiceGiveApi();
  const { mutate: returnMat, isPending: isReturning } = useServiceReturnApi();

  function submitGive(inv_id: string, user_cid: string, material_id: number | string, loan_id: number) {
    give(
      {
        inv_id,
        user_cid,
        material_id,
        loan_id,
        duration: form.duration,
        librarian_user_cid: authStore.user?.user_cid ?? "",
      },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.give_success"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("common.error"));
        },
      }
    );
  }

  function submitReturn(inv_id: string, user_cid: string, loan_id: number, material_id?: number | string) {
    returnMat(
      {
        inv_id,
        user_cid,
        loan_id,
        librarian_user_cid: authStore.user?.user_cid ?? "",
        material_id,
      },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.return_success"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("common.error"));
        },
      }
    );
  }

  return { form, isGiving, isReturning, submitGive, submitReturn, reset };
}
