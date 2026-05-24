import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { MediaShowResponse } from './types'

export function useMediaShowApi(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<MediaShowResponse>({
    queryKey: ['get:media-show', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`item/item/specs/${id.value}`)
      return res.data.data
    },
    enabled: !!id.value,
  })
}
