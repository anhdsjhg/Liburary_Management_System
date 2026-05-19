import { useMutation, useQueryClient } from '@tanstack/vue-query'
import axiosInstance from '@/application/configs/axios'
import type { GivePermissionsRequest, GivePermissionsResponse } from './types'
import { EPermissionKeys } from './enums'

export function useGivePermissionsApi() {
  const queryClient = useQueryClient()
  return useMutation<GivePermissionsResponse, Error, GivePermissionsRequest>({
    mutationKey: [EPermissionKeys.mutationKey],
    mutationFn: async ({ user_id, permissions }) => {
      const res = await axiosInstance.post(`manage/users/${user_id}/give_permissions`, { permissions })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EPermissionKeys.queryKey] })
    },
  })
}
