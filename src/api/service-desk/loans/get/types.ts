export type ServiceLoansRequest = {
  query?: string
  status?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export type ServiceLoan = {
  id: number
  user_id: number
  user_name: string
  user_cid: string
  media_id: number
  media_title: string
  inventory_number: string
  given_at: string
  due_at: string
  returned_at?: string
  status: string
  is_overdue: boolean
}

export type ServiceLoansResponse = {
  data: ServiceLoan[]
  total: number
  per_page: number
  current_page: number
  last_page: number
}
