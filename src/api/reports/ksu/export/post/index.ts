import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { KsuExportRequest, KsuExportResponse } from './types'
import { EKsuKeys } from './enums'

export function useKsuExportApi() {
  return useMutation<KsuExportResponse, Error, KsuExportRequest>({
    mutationKey: [EKsuKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('ksu_report/export', data)
      return res.data
    },
  })
}
