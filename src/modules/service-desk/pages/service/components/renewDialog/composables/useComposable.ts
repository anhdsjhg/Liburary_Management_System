import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useServiceRenewApi } from "@/api/service-desk/actions/renew/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";

export function useRenewDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { mutate: renew, isPending: isRenewing } = useServiceRenewApi();
  const loanId = ref<number | null>(null);
  const duration = ref(21);

  function setLoan(id: number, defaultDuration: number) {
    loanId.value = id;
    duration.value = defaultDuration;
  }

  function submit() {
    if (!loanId.value) return;
    renew(
      { loan_id: loanId.value, duration: duration.value },
      {
        onSuccess() {
          showSuccessToast(t("serviceDesk.renew_success"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("common.error"));
        },
      }
    );
  }

  return { duration, isRenewing, setLoan, submit };
}