export type DeletePermissionsRequest = {
  user_id: number
  permissions: number[]
}

export type DeletePermissionsResponse = {
  success: boolean
  message?: string
}
