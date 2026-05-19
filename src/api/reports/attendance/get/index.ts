import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { AttendanceResponse } from "./types";
import { EAttendanceKeys } from "./enums";

export function useAttendanceApi() {
  return useQuery<AttendanceResponse>({
    queryKey: [EAttendanceKeys.queryKey],
    queryFn: async () => {
      const res = await axiosInstance.get("attendance/virtual");
      return res.data;
    },
  });
}