import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ActPrintRequest, ActPrintResponse } from "./types";
import { EActPrintKeys } from "./enums";

export function useActPrintApi() {
  return useMutation<ActPrintResponse, Error, ActPrintRequest>({
    mutationKey: [EActPrintKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("acts/print", data, {
        responseType: "blob",
      });
      return res.data;
    },
  });
}
