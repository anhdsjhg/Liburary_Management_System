import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useServiceGiveApi } from "@/api/service-desk/actions/give/post";
import { useServiceReturnApi } from "@/api/service-desk/actions/return/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useActionForm } from "./useFormComposable";

export function useActionsPanel(onSuccess?: () => void) {
  const { t } = useI18n();
  const { form, reset } = useActionForm();
  const { mutate: give, isPending: isGiving } = useServiceGiveApi();
  const { mutate: returnMat, isPending: isReturning } = useServiceReturnApi();

  function submitGive(inv_id: string, user_cid: string, material_id: number | string) {
    give(
      { inv_id, user_cid, material_id, duration: form.duration },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.give_success"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("serviceDesk.give_success"));
        },
      }
    );
  }

  function submitReturn(inv_id: string, user_cid: string, loan_id: number) {
    returnMat(
      { inv_id, user_cid, loan_id },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.return_success"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("serviceDesk.return_success"));
        },
      }
    );
  }

  return { form, isGiving, isReturning, submitGive, submitReturn, reset };
}