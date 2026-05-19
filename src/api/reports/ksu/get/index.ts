import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { KsuReportRequest, KsuReportResponse } from "./types";
import { EKsuKeys } from "./enums";

export function useKsuReportApi() {
  return useMutation<KsuReportResponse, Error, KsuReportRequest>({
    mutationKey: [EKsuKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("ksu_report/get", data);
      return res.data;
    },
  });
}