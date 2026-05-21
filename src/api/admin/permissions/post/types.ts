export type GivePermissionsRequest = {
  user_id: number | string
  permissions: number[]
}

export type GivePermissionsResponse = {
  success: boolean
  message?: string
}
