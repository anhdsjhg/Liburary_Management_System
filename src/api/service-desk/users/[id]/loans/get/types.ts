export type ServiceUserLoansRequest = {
  page?: number
  per_page?: number
  status?: string
}

export type ServiceUserLoan = {
  id: number
  media_id: number
  media_title: string
  media_author: string
  inventory_number: string
  given_at: string
  due_at: string
  returned_at?: string
  status: string
  is_overdue: boolean
}

export type ServiceUserLoansResponse = {
  data: ServiceUserLoan[]
  total: number
  per_page: number
  current_page: number
  last_page: number
}
