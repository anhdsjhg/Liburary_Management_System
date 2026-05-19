import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { ItemUpdateRequest, ItemUpdateResponse } from './types'
import { EItemKeys } from './enums'

export function useItemUpdateApi() {
  const queryClient = useQueryClient()
  return useMutation<ItemUpdateResponse, Error, ItemUpdateRequest>({
    mutationKey: [EItemKeys.mutationKey],
    mutationFn: async ({ id, ...data }) => {
      const res = await axiosInstance.put('item/update', { id, ...data })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EItemKeys.queryKey] })
    },
  })
}
