import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ActExportRequest, ActExportResponse } from "./types";
import { EActExportKeys } from "./enums";

export function useActExportApi() {
  return useMutation<ActExportResponse, Error, ActExportRequest>({
    mutationKey: [EActExportKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("acts/export", data, {
        responseType: "blob",
      });
      return res.data;
    },
  });
}
