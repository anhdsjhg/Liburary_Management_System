import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { SetPenaltyRequest, CancelPenaltyRequest, PenaltyResponse } from "./types";
import { EServicePenaltyKeys } from "./enums";
import { EServiceUserKeys } from "../../../users/get/enums";

export function useServiceSetPenaltyApi() {
  const queryClient = useQueryClient();
  return useMutation<PenaltyResponse, Error, SetPenaltyRequest>({
    mutationKey: [EServicePenaltyKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("service/set_penalty", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.showQueryKey] });
    },
  });
}

export function useServiceCancelPenaltyApi() {
  const queryClient = useQueryClient();
  return useMutation<PenaltyResponse, Error, CancelPenaltyRequest>({
    mutationKey: [EServicePenaltyKeys.mutationKey + "-cancel"],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("service/cancel_penalty", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.showQueryKey] });
    },
  });
}