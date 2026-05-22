export type CancelReservationRequest = {
  material_id?: number | string
  inventory_id?: number | string
  user_id?: number | string
  media_id?: number | string
  comment?: string
}

export type CancelReservationResponse = {
  success: boolean
  message?: string
}
