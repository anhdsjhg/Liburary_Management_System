import { useQuery } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import axiosInstance from "@/application/configs/axios";
import type { UserAvailablePermissionsResponse } from "./types";

export function useUserAvailablePermissionsApi(
  userCid: Ref<string | null> | ComputedRef<string | null>
) {
  return useQuery<UserAvailablePermissionsResponse>({
    queryKey: ["get:user-available-permissions", userCid],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `manage/users/${userCid.value}/visualization/permissions`
      );
      return res.data;
    },
    enabled: () => !!userCid.value,
  });
}
