export type UserMyBooksInfo = {
  id: string
  username: string
  full_name: string
  user_cid: string
  address: string | null
  contact_email: string | null
  degree: string | null
  department: string | null
  mobile: string | null
  position: string | null
  status: string
  type: string
  is_active: string
}

export type UserMyBooksTotal = {
  borrowed: number
  returned: number
  dept: number
  penalty: number
}

export type UserMyBooksLoan = {
  loan_id: string | number
  inv_id: string | number
  barcode?: string
  title: string
  authors: string
  issue_date: string
  due_date: string
  delivery_date: string | null
  status: string
  media_id?: string | number
  renew_times?: string | number
  year?: string
  available?: string
  total?: string
  comments?: string | null
}

export type UserMyBooksData = {
  info: UserMyBooksInfo
  photo: string | null
  history: UserMyBooksLoan[]
  return: UserMyBooksLoan[]
  total: UserMyBooksTotal
  penalty: unknown | null
  penalty_loan: unknown[]
  duration: string | number
  isUnlimited: boolean
}
