import { ref, computed } from "vue";
import { useStatReportApi } from "@/api/reports/stat/get";
import { useExportComposable } from "../../../composables/useExportComposable";

export function useStatReportPage() {
  const { exportGet } = useExportComposable();
  const year = ref("");

  const params = computed(() => ({ year: year.value || undefined }));
  const { data, isLoading, refetch } = useStatReportApi(params);

  const rows = computed(() => data.value?.res ?? []);

  function doExport() {
    exportGet("stat_report/export", { year: year.value }, "stat_report.xlsx");
  }

  return { year, rows, isLoading, refetch, doExport };
}