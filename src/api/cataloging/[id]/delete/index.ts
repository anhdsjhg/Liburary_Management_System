import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { ECatalogingKeys } from "./enums";

export function useCatalogingDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { type: string; id: number | string }>({
    mutationKey: [ECatalogingKeys.mutationKey],
    mutationFn: async ({ type, id }) => {
      await axiosInstance.delete(`cataloging/material/delete/${type}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ECatalogingKeys.queryKey] });
    },
  });
}