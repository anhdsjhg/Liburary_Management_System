import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BatchExportRequest, BatchExportResponse } from "./types";
import { EBatchExportKeys } from "./enums";

export function useBatchExportApi() {
  return useMutation<BatchExportResponse, Error, BatchExportRequest>({
    mutationKey: [EBatchExportKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("batch/export", data, {
        responseType: "blob",
      });
      return res.data;
    },
  });
}
