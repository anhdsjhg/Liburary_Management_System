import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { SupplierUpdateRequest, SupplierUpdateResponse } from "./types";
import { ESupplierKeys } from "./enums";

export function useSupplierUpdateApi() {
  const queryClient = useQueryClient();
  return useMutation<SupplierUpdateResponse, Error, SupplierUpdateRequest>({
    mutationKey: [ESupplierKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.put("supplier/update", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ESupplierKeys.queryKey] });
    },
  });
}