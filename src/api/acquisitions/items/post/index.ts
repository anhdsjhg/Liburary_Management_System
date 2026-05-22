import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ItemCreateRequest, ItemCreateResponse } from "./types";
import { EItemKeys } from "./enums";

export function useItemCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<ItemCreateResponse, Error, ItemCreateRequest>({
    mutationKey: [EItemKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("item/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EItemKeys.queryKey] });
    },
  });
}
