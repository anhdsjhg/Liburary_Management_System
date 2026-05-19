import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { ItemMarkReceivedRequest, ItemMarkReceivedResponse } from './types'
import { EItemMarkReceivedKeys } from './enums'
import { EItemKeys } from '../../delete/enums'

export function useItemMarkReceivedApi() {
  const queryClient = useQueryClient()
  return useMutation<ItemMarkReceivedResponse, Error, ItemMarkReceivedRequest>({
    mutationKey: [EItemMarkReceivedKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('item/mark_as_received', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EItemKeys.queryKey] })
    },
  })
}
