import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ArrivalCreateRequest, ArrivalCreateResponse } from "./types";
import { EArrivalKeys } from "./enums";

export function useArrivalCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<ArrivalCreateResponse, Error, ArrivalCreateRequest>({
    mutationKey: [EArrivalKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("arrivals/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EArrivalKeys.queryKey] });
    },
  });
}