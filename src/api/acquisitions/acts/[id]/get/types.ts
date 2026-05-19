export type ActShowResponse = {
  id: number
  number: string
  type: string
  batch_id?: number
  batch_number?: string
  supplier_id?: number
  supplier_name?: string
  items: {
    id: number
    title: string
    quantity: number
    price?: number
  }[]
  total_items: number
  note?: string
  created_at: string
  updated_at: string
}
