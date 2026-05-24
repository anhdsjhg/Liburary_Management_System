import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { MediaSearchRequest, MediaSearchResponse } from './types'
import { EMediaSearchKeys } from './enums'

export function useMediaSearchApi(params?: Ref<MediaSearchRequest> | ComputedRef<MediaSearchRequest>) {
  return useQuery<MediaSearchResponse>({
    queryKey: [EMediaSearchKeys.queryKey, params],
    queryFn: async () => {
      const res = await axiosInstance.post('item/search', params?.value)
      return res.data
    },
  })
}
