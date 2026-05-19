export type ServiceUsersRequest = {
  add_options: Array<{ key: string; value: string }>;
  page?: number;
  per_page?: number;
};

export type ServiceUser = {
  id: number | string;
  username: string;
  full_name: string;
  user_cid: string;
  type: "student" | "employee";
  faculty?: string;
  department?: string;
  degree?: string;
  is_active: number;
  status: string;
};

export type ServiceUsersResponse = {
  res: {
    data: ServiceUser[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  filter: Record<string, string[]>;
  all: (number | string)[];
};