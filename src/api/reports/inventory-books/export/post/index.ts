import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { InventoryBooksExportRequest, InventoryBooksExportResponse } from './types'
import { EInventoryBooksKeys } from './enums'

export function useInventoryBooksExportApi() {
  return useMutation<InventoryBooksExportResponse, Error, InventoryBooksExportRequest>({
    mutationKey: [EInventoryBooksKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('inventory-books/export', data)
      return res.data
    },
  })
}
