import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { MostReadBooksExportRequest, MostReadBooksExportResponse } from './types'
import { EMostReadBooksKeys } from './enums'

export function useMostReadBooksExportApi() {
  return useMutation<MostReadBooksExportResponse, Error, MostReadBooksExportRequest>({
    mutationKey: [EMostReadBooksKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('most-read/export', data)
      return res.data
    },
  })
}
