import { computed, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { useDynamicReportShowApi } from "@/api/reports/dynamic/[reportId]/get";
import { useDynamicReportExecuteApi } from "@/api/reports/dynamic/[reportId]/execute/post";
import { useDynamicReportForm } from "./useFormComposable";
import { useExportComposable } from "../../../../composables/useExportComposable";

export function useDynamicReportDetail() {
  const route = useRoute();
  const { exportXlsx } = useExportComposable();

  const reportId = computed(() => route.params.reportId as string);
  const { data, isLoading: loadingReport } = useDynamicReportShowApi(reportId);
  const { mutate: execute, isPending: isExecuting } = useDynamicReportExecuteApi();

  const { selectedFields, parameterValues, initParams, buildPayload } = useDynamicReportForm();

  const results = ref<Record<string, unknown>[]>([]);

  const reportInfo = computed(() => data.value?.res?.info ?? null);
  const fields = computed(() => data.value?.res?.fields ?? []);
  const parameters = computed(() => data.value?.res?.parameters ?? []);

  watch(parameters, (params) => {
    if (params.length) initParams(params);
  });

  function run() {
    execute(buildPayload(reportId.value, fields.value), {
      onSuccess(data) {
        results.value = data.res;
      },
    });
  }

  function doExport() {
    exportXlsx(
      "dynamic_reports/export",
      buildPayload(reportId.value, fields.value),
      "dynamic_report.xlsx"
    );
  }

  return {
    reportInfo,
    fields,
    parameters,
    selectedFields,
    parameterValues,
    results,
    loadingReport,
    isExecuting,
    run,
    doExport,
  };
}