export type LoanRecord = {
  loan_id: number;
  inv_id: string;
  barcode: string;
  title: string;
  author: string | null;
  borrow_date: string;
  due_date: string;
  delivery_date: string | null;
  status: "issued" | "returned" | "overdue";
  renew_times: number;
  comments: string | null;
};

export type PenaltyRecord = {
  penalty_id: number;
  user_cid: string;
  due_date: string | null;
  start_date: string | null;
  is_active: number;
};

export type UserTotal = {
  borrowed: number;
  returned: number;
  dept: number;
  penalty: number;
};

export type ServiceUserInfo = {
  id: number | string;
  username: string;
  full_name: string;
  user_cid: string;
  type: "student" | "employee";
  faculty?: string;
  department?: string;
  degree?: string;
  is_active: number;
  contact_email?: string;
  mobile?: string;
  address?: string;
};

export type ServiceUserShowResponse = {
  res: {
    info: ServiceUserInfo;
    photo: string | null;
    history: LoanRecord[];
    total: UserTotal;
    return: LoanRecord[];
    penalty: PenaltyRecord | null;
    penalty_loan: Array<{
      inv_ids: string;
      due_dates: string;
      borrow_date: string;
      renew_count: string;
    }>;
    duration: number;
    isUnlimited: boolean;
  };
};