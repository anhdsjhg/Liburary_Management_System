import { useI18n } from "vue-i18n";
import { useBarcodePrintApi } from "@/api/reports/barcode/print/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useBarcodePrintForm } from "./useFormComposable";

export function usePrintDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { form } = useBarcodePrintForm();
  const { mutate: print, isPending: isPrinting } = useBarcodePrintApi();

  function submit(inventories: (string | number)[]) {
    print(
      { inventories, locale: form.locale },
      {
        onSuccess() {
          showSuccessToast(t("reports.print"));
          onSuccess?.();
        },
        onError() {
          showErrorToast(t("reports.print"));
        },
      }
    );
  }

  return { form, isPrinting, submit };
}