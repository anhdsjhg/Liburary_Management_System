import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ItemsGetRequest, ItemsGetResponse } from "./types";
import { EItemKeys } from "./enums";

export function useItemsGetApi() {
  return useMutation<ItemsGetResponse, Error, ItemsGetRequest>({
    mutationKey: [EItemKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("item/search", data);
      return res.data;
    },
  });
}
