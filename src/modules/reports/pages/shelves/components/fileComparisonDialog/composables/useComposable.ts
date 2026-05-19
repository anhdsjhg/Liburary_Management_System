import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useShelvesFileComparisonApi } from "@/api/reports/shelves/file-comparison/post";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import { useFileComparisonForm } from "./useFormComposable";
import type { ShelvesFileComparisonResponse } from "@/api/reports/shelves/file-comparison/post/types";

export function useFileComparisonDialog(onSuccess?: () => void) {
  const { t } = useI18n();
  const { originalFile, deviceFile, reset, toFormData } = useFileComparisonForm();
  const { mutate: compare, isPending: isComparing } = useShelvesFileComparisonApi();
  const comparisonResult = ref<ShelvesFileComparisonResponse | null>(null);

  function submit() {
    compare(toFormData(), {
      onSuccess(data) {
        comparisonResult.value = data;
        showSuccessToast(t("reports.compare_files"));
        onSuccess?.();
      },
      onError() {
        showErrorToast(t("reports.compare_files"));
      },
    });
  }

  return { originalFile, deviceFile, isComparing, comparisonResult, reset, submit };
}