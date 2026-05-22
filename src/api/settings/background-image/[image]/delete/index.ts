import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import { EBackgroundImageDeleteKeys } from "./enums";
import { EBackgroundImageKeys } from "../../get/enums";

export function useBackgroundImageDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationKey: [EBackgroundImageDeleteKeys.mutationKey],
    mutationFn: async (filename: string) => {
      await axiosInstance.delete(`background-image/delete/${filename}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EBackgroundImageKeys.queryKey] });
    },
  });
}
