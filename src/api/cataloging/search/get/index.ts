import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { CatalogingSearchRequest, CatalogingSearchResponse } from "./types";
import { ECatalogingKeys } from "./enums";

export function useCatalogingSearchApi() {
  return useMutation<CatalogingSearchResponse, Error, CatalogingSearchRequest>({
    mutationKey: [ECatalogingKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("cataloging/material/search", data);
      return res.data;
    },
  });
}
