import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { InventoryBooksSearchRequest, InventoryBooksSearchResponse } from "./types";
import { EInventoryBooksKeys } from "./enums";

export function useInventoryBooksSearchApi() {
  return useMutation<InventoryBooksSearchResponse, Error, InventoryBooksSearchRequest>({
    mutationKey: [EInventoryBooksKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("inventory-books/search", data);
      return res.data;
    },
  });
}