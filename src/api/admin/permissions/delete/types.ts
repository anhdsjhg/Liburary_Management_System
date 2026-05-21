export type DeletePermissionsRequest = {
  user_id: number | string
  permissions: number[]
}

export type DeletePermissionsResponse = {
  success: boolean
  message?: string
}
