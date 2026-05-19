import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { ShelvesExportRequest, ShelvesExportResponse } from './types'
import { EShelvesKeys } from './enums'

export function useShelvesExportApi() {
  return useMutation<ShelvesExportResponse, Error, ShelvesExportRequest>({
    mutationKey: [EShelvesKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('shelves/export', data)
      return res.data
    },
  })
}
