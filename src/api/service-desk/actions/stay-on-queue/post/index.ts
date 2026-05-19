import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { StayOnQueueRequest, StayOnQueueResponse } from './types'
import { EServiceStayOnQueueKeys } from './enums'
import { EServiceUserKeys } from '../../../users/get/enums'

export function useServiceStayOnQueueApi() {
  const queryClient = useQueryClient()
  return useMutation<StayOnQueueResponse, Error, StayOnQueueRequest>({
    mutationKey: [EServiceStayOnQueueKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('media/stay_on_queue', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.listQueryKey] })
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.loansQueryKey] })
    },
  })
}
