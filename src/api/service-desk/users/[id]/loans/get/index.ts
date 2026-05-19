import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { ServiceUserLoansRequest, ServiceUserLoansResponse } from './types'
import { EServiceUserKeys } from './enums'

export function useServiceUserLoansApi(
  userId: Ref<number | string> | ComputedRef<number | string>,
  params?: Ref<ServiceUserLoansRequest> | ComputedRef<ServiceUserLoansRequest>
) {
  return useQuery<ServiceUserLoansResponse>({
    queryKey: [EServiceUserKeys.loansQueryKey, userId, params],
    queryFn: async () => {
      const res = await axiosInstance.get(`service/user/${userId.value}/loans`, {
        params: params?.value,
      })
      return res.data
    },
    enabled: !!userId.value,
  })
}
