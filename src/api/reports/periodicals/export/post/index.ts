import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { PeriodicalsExportRequest, PeriodicalsExportResponse } from './types'
import { EPeriodicalsKeys } from './enums'

export function usePeriodicalsExportApi() {
  return useMutation<PeriodicalsExportResponse, Error, PeriodicalsExportRequest>({
    mutationKey: [EPeriodicalsKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('periodicals_report/export', data)
      return res.data
    },
  })
}
