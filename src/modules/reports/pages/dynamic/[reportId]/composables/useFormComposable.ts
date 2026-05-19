import { reactive, ref } from "vue";
import type { ReportField, ReportParameter } from "@/api/reports/dynamic/[reportId]/get/types";

export function useDynamicReportForm() {
  const selectedFields = ref<ReportField[]>([]);
  const parameterValues = reactive<Record<string, string | string[] | null>>({});

  function initParams(params: ReportParameter[]) {
    params.forEach((p) => {
      parameterValues[p.parameter] = p.v_component === "checkbox" ? [] : null;
    });
  }

  function buildPayload(queryId: number | string, allFields: ReportField[]) {
    const fields = selectedFields.value.length ? selectedFields.value : allFields;
    return {
      query_id: queryId,
      fields: fields.map((f) => ({ key: f.field, title: f.title })),
      parameters: Object.entries(parameterValues).map(([parameter, value]) => ({
        parameter,
        value,
        v_component: "input",
      })),
    };
  }

  return { selectedFields, parameterValues, initParams, buildPayload };
}