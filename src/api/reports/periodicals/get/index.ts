import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { PeriodicalsRequest, PeriodicalsResponse } from "./types";
import { EPeriodicalsKeys } from "./enums";

export function usePeriodicalsApi() {
  return useMutation<PeriodicalsResponse, Error, PeriodicalsRequest>({
    mutationKey: [EPeriodicalsKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("periodicals_report/get", data);
      return res.data;
    },
  });
}