import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { DeletePermissionsRequest, DeletePermissionsResponse } from './types'
import { EPermissionKeys } from './enums'

export function useDeletePermissionsApi() {
  const queryClient = useQueryClient()
  return useMutation<DeletePermissionsResponse, Error, DeletePermissionsRequest>({
    mutationKey: [EPermissionKeys.mutationKey],
    mutationFn: async ({ user_id, permissions }) => {
      const res = await axiosInstance.post(`manage/users/${user_id}/delete_permissions`, { permissions })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EPermissionKeys.queryKey] })
    },
  })
}
