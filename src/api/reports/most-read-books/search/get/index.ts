import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { MostReadBooksRequest, MostReadBooksResponse } from "./types";
import { EMostReadBooksKeys } from "./enums";

export function useMostReadBooksApi() {
  return useMutation<MostReadBooksResponse, Error, MostReadBooksRequest>({
    mutationKey: [EMostReadBooksKeys.queryKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("most-read/search", data);
      return res.data;
    },
  });
}