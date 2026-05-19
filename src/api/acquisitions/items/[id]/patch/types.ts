export type ItemUpdateRequest = {
  id: number | string
  title?: string
  author?: string
  publisher_id?: number
  year?: number
  price?: number
  quantity?: number
}

export type ItemUpdateResponse = {
  id: number
  title: string
  updated_at: string
}
