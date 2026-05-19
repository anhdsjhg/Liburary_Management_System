import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { CatalogingUpdateRequest, CatalogingUpdateResponse } from "./types";
import { ECatalogingKeys } from "./enums";

export function useCatalogingUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<CatalogingUpdateResponse, Error, CatalogingUpdateRequest>({
    mutationKey: [ECatalogingKeys.mutationKey],
    mutationFn: async ({ type, id, data }) => {
      const res = await axiosInstance.post(
        `cataloging/material/${type}/${id}/edit`,
        { data }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ECatalogingKeys.queryKey] });
    },
  });
}