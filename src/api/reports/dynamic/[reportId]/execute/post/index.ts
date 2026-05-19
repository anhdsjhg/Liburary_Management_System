import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { DynamicReportExecuteRequest, DynamicReportExecuteResponse } from "./types";
import { EDynamicReportKeys } from "../../get/enums";

export function useDynamicReportExecuteApi() {
  return useMutation<DynamicReportExecuteResponse, Error, DynamicReportExecuteRequest>({
    mutationKey: [EDynamicReportKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("dynamic_reports/execute", data);
      return res.data;
    },
  });
}