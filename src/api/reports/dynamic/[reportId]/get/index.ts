import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { DynamicReportShowResponse } from "./types";
import { EDynamicReportKeys } from "./enums";

export function useDynamicReportShowApi(
  reportId: Ref<number | string> | ComputedRef<number | string>
) {
  return useQuery<DynamicReportShowResponse>({
    queryKey: [EDynamicReportKeys.showQueryKey, reportId],
    queryFn: async () => {
      const res = await axiosInstance.get("dynamic_reports/single_report", {
        params: { query_id: reportId.value },
      });
      return res.data;
    },
    enabled: () => !!reportId.value,
  });
}