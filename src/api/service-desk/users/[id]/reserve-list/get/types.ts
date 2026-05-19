export type ServiceUserReserveItem = {
  id: number
  media_id: number
  media_title: string
  media_author: string
  reserved_at: string
  expires_at: string
  status: string
  queue_position?: number
}

export type ServiceUserReserveListResponse = ServiceUserReserveItem[]
