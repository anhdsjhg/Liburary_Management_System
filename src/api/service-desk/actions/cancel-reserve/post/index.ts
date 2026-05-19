import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { CancelReservationRequest, CancelReservationResponse } from './types'
import { EServiceCancelReserveKeys } from './enums'
import { EServiceUserKeys } from '../../../users/get/enums'

export function useServiceCancelReserveApi() {
  const queryClient = useQueryClient()
  return useMutation<CancelReservationResponse, Error, CancelReservationRequest>({
    mutationKey: [EServiceCancelReserveKeys.mutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('media/cancel_reservation', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.listQueryKey] })
      queryClient.invalidateQueries({ queryKey: [EServiceUserKeys.loansQueryKey] })
    },
  })
}
