import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { ActShowResponse } from './types'

export function useActShowApi(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<ActShowResponse>({
    queryKey: ['get:acquisitions-act-show', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`acts/show/${id.value}`)
      return res.data.data
    },
    enabled: !!id.value,
  })
}
