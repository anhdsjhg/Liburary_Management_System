import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { MediaExportRequest, MediaExportResponse } from './types'
import { EMediaExportKeys } from './enums'

export function useMediaExportApi() {
  return useMutation<MediaExportResponse, Error, MediaExportRequest>({
    mutationKey: [EMediaExportKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('item/save-excel', data)
      return res.data
    },
  })
}
