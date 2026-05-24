import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { MediaUpdateRequest, MediaUpdateResponse } from './types'
import { EMediaKeys } from './enums'

export function useMediaUpdateApi() {
  const queryClient = useQueryClient()
  return useMutation<MediaUpdateResponse, Error, MediaUpdateRequest>({
    mutationKey: [EMediaKeys.mutationKey],
    mutationFn: async ({ id, ...data }) => {
      const res = await axiosInstance.patch(`item/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMediaKeys.queryKey] })
    },
  })
}
