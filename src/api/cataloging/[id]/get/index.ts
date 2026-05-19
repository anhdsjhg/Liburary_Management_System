import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { CatalogingShowResponse } from "./types";

export function useCatalogingShowApi(
  type: Ref<string> | ComputedRef<string>,
  id: Ref<number | string> | ComputedRef<number | string>
) {
  return useQuery<CatalogingShowResponse>({
    queryKey: ["get:cataloging-show", type, id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `cataloging/material/${type.value}/${id.value}`
      );
      return res.data;
    },
    enabled: () => !!id.value && !!type.value,
  });
}