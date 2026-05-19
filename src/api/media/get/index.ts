import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { MediaGetRequest, MediaGetResponse } from './types'
import { EMediaKeys } from './enums'

export function useMediaGetApi(params?: Ref<MediaGetRequest> | ComputedRef<MediaGetRequest>) {
  return useQuery<MediaGetResponse>({
    queryKey: [EMediaKeys.queryKey, params],
    queryFn: async () => {
      const res = await axiosInstance.get('media/index', {
        params: params?.value,
      })
      return res.data
    },
  })
}
