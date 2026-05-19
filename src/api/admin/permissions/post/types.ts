export type GivePermissionsRequest = {
  user_id: number
  permissions: number[]
}

export type GivePermissionsResponse = {
  success: boolean
  message?: string
}
