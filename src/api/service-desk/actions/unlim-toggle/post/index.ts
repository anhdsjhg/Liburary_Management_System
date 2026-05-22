import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { UnlimToggleRequest, UnlimToggleResponse } from "./types";
import { EServiceUserKeys } from "../../../users/get/enums";

export function useServiceUnlimToggleApi() {
  const queryClient = useQueryClient();
  return useMutation<UnlimToggleResponse, Error, UnlimToggleRequest>({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("service/user/unlim/toggle", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.showQueryKey] });
    },
  });
}
