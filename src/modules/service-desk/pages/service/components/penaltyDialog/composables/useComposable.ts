import { useI18n } from "vue-i18n";
import { useServiceSetPenaltyApi, useServiceCancelPenaltyApi } from "@/api/service-desk/actions/penalty/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { usePenaltyForm } from "./useFormComposable";

export function usePenaltyDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { form, setPenaltyId } = usePenaltyForm();
  const { mutate: setPenalty, isPending: isSetting } = useServiceSetPenaltyApi();
  const { mutate: cancelPenalty, isPending: isCancelling } = useServiceCancelPenaltyApi();

  function submitSet() {
    if (!form.penalty_id) return;
    setPenalty(
      {
      penalty_id: form.penalty_id,
      user_cid: form.user_cid,
      },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.penalty_set"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("serviceDesk.penalty_set"));
        },
      }
    );
  }

  function submitCancel() {
    if (!form.penalty_id) return;
    cancelPenalty(
      {
        penalty_id: form.penalty_id,
        user_cid: form.user_cid,
      },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.penalty_cancelled"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("serviceDesk.penalty_cancelled"));
        },
      }
    );
  }

  return { form, isSetting, isCancelling, setPenaltyId, submitSet, submitCancel };
}