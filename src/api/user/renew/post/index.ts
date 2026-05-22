import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";

export type UserRenewRequest = {
  loan_id: number;
  inv_id: number | string;
  user_cid: string;
  duration: number;
  librarian_user_cid: string;
};

export type UserRenewResponse = {
  res: boolean;
};

export function useUserRenewApi() {
  const queryClient = useQueryClient();
  return useMutation<UserRenewResponse, Error, UserRenewRequest>({
    mutationKey: ["mutate:user-renew"],
    mutationFn: async (data) => {
      const res = await axiosInstance.post("media/renew", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get:user-my-books"] });
    },
  });
}
