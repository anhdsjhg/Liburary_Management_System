import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { CatalogingSearchRequest, CatalogingSearchResponse } from "./types";
import { ECatalogingKeys } from "./enums";

function buildSearchParams(data: CatalogingSearchRequest): string {
  const params = new URLSearchParams();
  data.add_options.forEach((opt, i) => {
    params.set(`add_options[${i}][key]`, opt.key);
    if (Array.isArray(opt.value)) {
      opt.value.forEach((v, j) => params.set(`add_options[${i}][value][${j}]`, v));
    } else {
      params.set(`add_options[${i}][value]`, opt.value);
    }
  });
  if (data.page != null) params.set("page", String(data.page));
  if (data.per_page != null) params.set("per_page", String(data.per_page));
  return params.toString();
}

export function useCatalogingSearchApi() {
  return useMutation<CatalogingSearchResponse, Error, CatalogingSearchRequest>({
    mutationKey: [ECatalogingKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.get(`cataloging/search?${buildSearchParams(data)}`);
      return res.data;
    },
  });
}