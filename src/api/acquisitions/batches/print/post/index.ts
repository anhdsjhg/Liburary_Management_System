import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { BatchPrintRequest, BatchPrintResponse } from "./types";
import { EBatchPrintKeys } from "./enums";

export function useBatchPrintApi() {
  return useMutation<BatchPrintResponse, Error, BatchPrintRequest>({
    mutationKey: [EBatchPrintKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("batch/print", data, {
        responseType: "blob",
      });
      return res.data;
    },
  });
}
