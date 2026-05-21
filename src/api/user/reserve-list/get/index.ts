import { useQuery } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { UserReserveItem } from './types'

export function useUserReserveListApi(enabled: ComputedRef<boolean>) {
  return useQuery<UserReserveItem[]>({
    queryKey: ['get:user-reserve-list'],
    queryFn: async () => {
      const res = await axiosInstance.get('user/reserve_list')
      return res.data.res
    },
    enabled,
  })
}
