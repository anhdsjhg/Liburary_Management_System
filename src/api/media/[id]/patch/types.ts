export type MediaUpdateRequest = {
  id: number | string
  title?: string
  author?: string
  genre?: string
  year?: number
  publisher?: string
  description?: string
  cover_url?: string
}

export type MediaUpdateResponse = {
  id: number
  title: string
  updated_at: string
}
