import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { StatExportRequest, StatExportResponse } from './types'
import { EStatKeys } from './enums'

export function useStatExportApi() {
  return useMutation<StatExportResponse, Error, StatExportRequest>({
    mutationKey: [EStatKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('stat_report/export', data)
      return res.data
    },
  })
}
