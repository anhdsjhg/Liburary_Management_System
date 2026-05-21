import { useQuery } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { UserMyBooksData } from './types'

export function useUserMyBooksApi(enabled: ComputedRef<boolean>) {
  return useQuery<UserMyBooksData>({
    queryKey: ['get:user-my-books'],
    queryFn: async () => {
      const res = await axiosInstance.get('user/my-books')
      return res.data.res
    },
    enabled,
  })
}
