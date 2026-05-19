export type StayOnQueueRequest = {
  inventory_id?: number | string
  user_id?: number | string
  media_id?: number | string
  comment?: string
}

export type StayOnQueueResponse = {
  success: boolean
  message?: string
}
