import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { ServiceUserReserveListResponse } from './types'
import { EServiceUserKeys } from './enums'

export function useServiceUserReserveListApi(userId: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<ServiceUserReserveListResponse>({
    queryKey: [EServiceUserKeys.reserveListQueryKey, userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`service/user/${userId.value}/reserve-list`)
      return res.data
    },
    enabled: !!userId.value,
  })
}
