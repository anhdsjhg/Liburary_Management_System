import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { UserVisualizationResponse } from "./types";

export function useUserVisualizationApi(
  userCid: Ref<string | null> | ComputedRef<string | null>
) {
  return useQuery<UserVisualizationResponse>({
    queryKey: ["get:user-visualization", userCid],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `manage/users/${userCid.value}/visualization`
      );
      return res.data;
    },
    enabled: () => !!userCid.value,
  });
}