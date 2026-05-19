import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { NotFoundBooksRequest, NotFoundBooksResponse } from "./types";
import { ENotFoundBooksKeys } from "./enums";

export function useNotFoundBooksApi() {
  return useMutation<NotFoundBooksResponse, Error, NotFoundBooksRequest>({
    mutationKey: [ENotFoundBooksKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("nfbooks/search", data);
      return res.data;
    },
  });
}