import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import { EMediaKeys } from './enums'

export function useMediaDeleteApi() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, number | string>({
    mutationKey: [EMediaKeys.mutationKey],
    mutationFn: async (id) => {
      await axiosInstance.delete(`item/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMediaKeys.queryKey] })
    },
  })
}
