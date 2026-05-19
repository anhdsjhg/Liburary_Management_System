import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { ServiceUserShowResponse } from "./types";
import { EServiceUserKeys } from "../get/enums";

export function useServiceUserShowApi(
  type: Ref<string> | ComputedRef<string>,
  id: Ref<number | string> | ComputedRef<number | string>
) {
  return useQuery<ServiceUserShowResponse>({
    queryKey: [EServiceUserKeys.showQueryKey, type, id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `service/user/${type.value}/${id.value}`
      );
      return res.data;
    },
    enabled: () => !!id.value && !!type.value,
  });
}