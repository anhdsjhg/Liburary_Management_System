import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { ESupplierKeys } from "./enums";

export function useSupplierDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number | string>({
    mutationKey: [ESupplierKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`supplier/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ESupplierKeys.queryKey] });
    },
  });
}