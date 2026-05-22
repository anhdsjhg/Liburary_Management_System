import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { SuppliersGetRequest, SuppliersGetResponse } from "./types";
import { ESupplierKeys } from "./enums";

export function useSuppliersGetApi() {
  return useMutation<SuppliersGetResponse, Error, SuppliersGetRequest>({
    mutationKey: [ESupplierKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("supplier/search", data);
      return res.data;
    },
  });
}
