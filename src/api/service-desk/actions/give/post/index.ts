import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { GiveMaterialRequest, GiveMaterialResponse } from "./types";
import { EServiceGiveKeys } from "./enums";
import { EServiceUserKeys } from "../../../users/get/enums";

export function useServiceGiveApi() {
  const queryClient = useQueryClient();
  return useMutation<GiveMaterialResponse, Error, GiveMaterialRequest>({
    mutationKey: [EServiceGiveKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("service/media/give", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.showQueryKey] });
    },
  });
}