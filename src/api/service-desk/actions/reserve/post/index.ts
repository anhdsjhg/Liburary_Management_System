import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { SetActivityRequest, SetActivityResponse } from "./types";
import { EServiceUserKeys } from "../../../users/get/enums";

export function useServiceSetActivityApi() {
  const queryClient = useQueryClient();
  return useMutation<SetActivityResponse, Error, SetActivityRequest>({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("service/set_activity", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.showQueryKey] });
    },
  });
}