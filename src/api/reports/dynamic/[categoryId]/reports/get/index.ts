import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { DynamicReportsResponse } from "./types";
import { EDynamicReportKeys } from "../../../categories/get/enums";

export function useDynamicReportsApi(
  categoryId: Ref<number | string> | ComputedRef<number | string>
) {
  return useQuery<DynamicReportsResponse>({
    queryKey: [EDynamicReportKeys.listQueryKey, categoryId],
    queryFn: async () => {
      const res = await axiosInstance.get("dynamic_reports/reports", {
        params: { category_id: categoryId.value },
      });
      return res.data;
    },
    enabled: () => !!categoryId.value,
  });
}