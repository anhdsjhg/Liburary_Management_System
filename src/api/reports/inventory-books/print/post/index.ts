import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { InventoryBooksPrintRequest, InventoryBooksPrintResponse } from './types'
import { EInventoryBooksKeys } from './enums'

export function useInventoryBooksPrintApi() {
  return useMutation<InventoryBooksPrintResponse, Error, InventoryBooksPrintRequest>({
    mutationKey: [EInventoryBooksKeys.printMutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('inventory-books/print', data)
      return res.data
    },
  })
}
