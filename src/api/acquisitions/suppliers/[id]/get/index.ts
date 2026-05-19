import { useQuery } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import axiosInstance from '@/application/configs/axios'
import type { SupplierShowResponse } from './types'

export function useSupplierShowApi(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery<SupplierShowResponse>({
    queryKey: ['get:acquisitions-supplier-show', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`supplier/show/${id.value}`)
      return res.data.data
    },
    enabled: !!id.value,
  })
}
