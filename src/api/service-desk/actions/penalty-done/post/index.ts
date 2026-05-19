import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { CancelPenaltyRequest, CancelPenaltyResponse } from './types'
import { EServicePenaltyDoneKeys } from './enums'
import { EServiceUserKeys } from '../../../users/get/enums'

export function useServicePenaltyDoneApi() {
  const queryClient = useQueryClient()
  return useMutation<CancelPenaltyResponse, Error, CancelPenaltyRequest>({
    mutationKey: [EServicePenaltyDoneKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('service/cancel_penalty', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.listQueryKey] })
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.loansQueryKey] })
    },
  })
}
