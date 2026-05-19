import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { ServiceLoansRequest, ServiceLoansResponse } from './types'
import { EServiceLoansKeys } from './enums'

export function useServiceLoansApi(params?: Ref<ServiceLoansRequest> | ComputedRef<ServiceLoansRequest>) {
  return useQuery<ServiceLoansResponse>({
    queryKey: [EServiceLoansKeys.queryKey, params],
    queryFn: async () => {
      const res = await axiosInstance.get('service/loans', {
        params: params?.value,
      })
      return res.data
    },
  })
}
