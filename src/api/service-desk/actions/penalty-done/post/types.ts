export type CancelPenaltyRequest = {
  inventory_id?: number | string
  user_id?: number | string
  media_id?: number | string
  comment?: string
}

export type CancelPenaltyResponse = {
  success: boolean
  message?: string
}
