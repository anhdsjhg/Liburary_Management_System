import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { RenewMaterialRequest, RenewMaterialResponse } from "./types";
import { EServiceRenewKeys } from "./enums";
import { EServiceUserKeys } from "../../../users/get/enums";

export function useServiceRenewApi() {
  const queryClient = useQueryClient();
  return useMutation<RenewMaterialResponse, Error, RenewMaterialRequest>({
    mutationKey: [EServiceRenewKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("service/media/renew", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.showQueryKey] });
    },
  });
}