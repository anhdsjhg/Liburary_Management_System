import { useMutation } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { ShelvesExportExcelRequest, ShelvesExportExcelResponse } from './types'
import { EShelvesKeys } from './enums'

export function useShelvesExportExcelApi() {
  return useMutation<ShelvesExportExcelResponse, Error, ShelvesExportExcelRequest>({
    mutationKey: [EShelvesKeys.excelMutationKey],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('shelves/export_excel', data)
      return res.data
    },
  })
}
