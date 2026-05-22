import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { ItemsByBatchResponse } from "./types";
import { EItemsByBatchKeys } from "./enums";

export function useItemsByBatchApi(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<ItemsByBatchResponse>({
    queryKey: [EItemsByBatchKeys.queryKey, id],
    queryFn: async () => {
      const res = await axiosInstance.get(`item/by/batch/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });
}
