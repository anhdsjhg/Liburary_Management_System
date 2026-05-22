import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { ItemShowResponse } from "./types";

export function useItemShowApi(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<ItemShowResponse>({
    queryKey: ["get:acquisitions-item-show", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`item/show/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });
}
