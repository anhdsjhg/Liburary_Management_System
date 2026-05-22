import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { ItemsByActResponse } from "./types";
import { EItemsByActKeys } from "./enums";

export function useItemsByActApi(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<ItemsByActResponse>({
    queryKey: [EItemsByActKeys.queryKey, id],
    queryFn: async () => {
      const res = await axiosInstance.get(`item/by/act/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });
}
