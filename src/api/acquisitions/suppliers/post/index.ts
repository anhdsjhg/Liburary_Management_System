import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { SupplierCreateRequest, SupplierCreateResponse } from "./types";
import { ESupplierKeys } from "./enums";

export function useSupplierCreateApi() {
  const queryClient = useQueryClient();
  return useMutation<SupplierCreateResponse, Error, SupplierCreateRequest>({
    mutationKey: [ESupplierKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("supplier/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ESupplierKeys.queryKey] });
    },
  });
}