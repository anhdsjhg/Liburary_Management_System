import { useMutation } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { ServiceUsersRequest, ServiceUsersResponse } from "./types";
import { EServiceUserKeys } from "./enums";

export function useServiceUsersSearchApi() {
  return useMutation<ServiceUsersResponse, Error, ServiceUsersRequest>({
    mutationKey: [EServiceUserKeys.listQueryKey],
    mutationFn: async (data) => {
      const userType = data.add_options.find((o) => o.key === "type")?.value ?? "student";
      const payload = {
        ...data,
        add_options: data.add_options.filter((o) => o.key !== "type"),
      };
      const res = await axiosInstance.post(
        `service/user/${userType}/search`,
        payload
      );
      return res.data;
    },
  });
}