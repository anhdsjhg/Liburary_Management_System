import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ReturnMaterialRequest, ReturnMaterialResponse } from "./types";
import { EServiceReturnKeys } from "./enums";
import { EServiceUserKeys } from "../../../users/get/enums";

export function useServiceReturnApi() {
  const queryClient = useQueryClient();
  return useMutation<ReturnMaterialResponse, Error, ReturnMaterialRequest>({
    mutationKey: [EServiceReturnKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("service/media/back", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.showQueryKey] });
    },
  });
}