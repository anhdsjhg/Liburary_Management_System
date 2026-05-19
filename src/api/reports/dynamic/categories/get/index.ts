import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { DynamicReportCategoriesResponse } from "./types";
import { EDynamicReportKeys } from "./enums";

export function useDynamicReportCategoriesApi() {
  return useQuery<DynamicReportCategoriesResponse>({
    queryKey: [EDynamicReportKeys.categoriesQueryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("dynamic_reports/categories");
      return res.data;
    },
  });
}