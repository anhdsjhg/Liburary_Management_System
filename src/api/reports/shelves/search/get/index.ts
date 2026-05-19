import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ShelvesSearchRequest, ShelvesSearchResponse } from "./types";
import { EShelvesKeys } from "./enums";

export function useShelvesSearchApi() {
  return useMutation<ShelvesSearchResponse, Error, ShelvesSearchRequest>({
    mutationKey: [EShelvesKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("shelves/search", data);
      return res.data;
    },
  });
}