import { useI18n } from "vue-i18n";
import { useServiceRenewApi } from "@/api/service-desk/actions/renew/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useRenewForm } from "./useFormComposable";

export function useRenewDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { mutate: renew, isPending: isRenewing } = useServiceRenewApi();
  const { form, toRequest, setLoan } = useRenewForm();

  function submit() {
    renew(toRequest(), {
      onSuccess() {
        showSuccessToast(t("serviceDesk.renew_success"));
        onSuccess?.();
      },
      onError() {
        showErrorToast(t("serviceDesk.renew_success"));
      },
    });
  }

  return { form, isRenewing, setLoan, submit };
}