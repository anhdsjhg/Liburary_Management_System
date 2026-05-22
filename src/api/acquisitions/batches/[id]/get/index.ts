import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { BatchShowResponse } from "./types";

export function useBatchShowApi(
  id: Ref<number | string> | ComputedRef<number | string>
) {
  return useQuery<BatchShowResponse>({
    queryKey: ["get:batch-show", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`batch/show/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });
}
