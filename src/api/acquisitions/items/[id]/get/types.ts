export type ItemShowResponse = {
  id: number
  inventory_number: string
  title: string
  author?: string
  type: string
  publisher_id?: number
  publisher_name?: string
  batch_id?: number
  batch_number?: string
  year?: number
  price?: number
  quantity: number
  received: boolean
  received_at?: string
  specialities?: { id: number; name: string }[]
  created_at: string
  updated_at: string
}
