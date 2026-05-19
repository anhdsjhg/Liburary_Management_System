import { useQuery } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { AuthorityDataResponse } from './types'

export function useCatalogingAuthorityDataApi() {
  return useQuery<AuthorityDataResponse>({
    queryKey: ['get:cataloging-authority-data'],
    queryFn: async () => {
      const res = await axiosInstance.get('cataloging/authority')
      return res.data
    },
  })
}
