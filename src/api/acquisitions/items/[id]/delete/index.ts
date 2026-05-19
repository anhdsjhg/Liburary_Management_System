import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import { EItemKeys } from './enums'

export function useItemDeleteApi() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationKey: [EItemKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`item/delete/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EItemKeys.queryKey] })
    },
  })
}
