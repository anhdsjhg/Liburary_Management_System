import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { PublisherShowResponse } from './types'

export function usePublisherShowApi(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<PublisherShowResponse>({
    queryKey: ['get:acquisitions-publisher-show', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`publisher/show/${id.value}`)
      return res.data.data
    },
    enabled: !!id.value,
  })
}
