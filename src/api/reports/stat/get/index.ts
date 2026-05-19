import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { StatReportRequest, StatReportResponse } from "./types";
import { EStatKeys } from "./enums";

export function useStatReportApi(
  params?: Ref<StatReportRequest> | ComputedRef<StatReportRequest>
) {
  return useQuery<StatReportResponse>({
    queryKey: [EStatKeys.queryKey, params],
    queryFn: async () => {
      const res = await axiosInstance.get("stat_report/get", {
        params: params?.value,
      });
      return res.data;
    },
  });
}