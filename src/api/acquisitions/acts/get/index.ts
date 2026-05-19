import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ActsGetRequest, ActsGetResponse } from "./types";
import { EActKeys } from "./enums";

export function useActsGetApi() {
  return useMutation<ActsGetResponse, Error, ActsGetRequest>({
    mutationKey: [EActKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("acts/search", data);
      return res.data;
    },
  });
}