import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ArrivalsGetResponse } from "./types";
import { EArrivalKeys } from "./enums";

export function useArrivalGetApi(limit?: number) {
  return useQuery<ArrivalsGetResponse>({
    queryKey: [EArrivalKeys.queryKey, limit],
    queryFn: async () => {
      const res = await axiosInstance.get("arrivals/index", {
        params: { limit, order: "desc" },
      });
      return res.data;
    },
  });
}