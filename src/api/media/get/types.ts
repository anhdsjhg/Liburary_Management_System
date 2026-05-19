export type MediaGetRequest = {
  query?: string
  type?: string
  genre?: string
  sort_field?: string
  sort_direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export type MediaItem = {
  id: number
  title: string
  author: string
  type: string
  genre: string
  isbn: string
  year: number
  publisher: string
  inventory_number: string
  status: string
  cover_url?: string
}

export type MediaGetResponse = {
  data: MediaItem[]
  total: number
  per_page: number
  current_page: number
  last_page: number
}
