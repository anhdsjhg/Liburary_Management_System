export type ItemCreateRequest = {
  inventory_number?: string
  title: string
  author?: string
  type: string
  publisher_id?: number
  batch_id?: number
  year?: number
  price?: number
  quantity?: number
}

export type ItemCreateResponse = {
  id: number
  inventory_number: string
  title: string
  created_at: string
}
