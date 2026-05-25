export type ItemsGetRequest = {
  add_options?: Array<{ key: string; value: unknown }>;
  search_options?: Array<{ key: string; operator: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type AcquisitionItem = {
  id: string;
  barcode: string | null;
  old_inv_id: string | null;
  batch_id: string | null;
  book_id: string | null;
  journal_id: string | null;
  disc_id: string | null;
  j_issue_id: string | null;
  prog_code: string | null;
  title: string | null;
  author: string | null;
  isbn: string | null;
  pub_year: string | null;
  pub_city: string | null;
  item_key: string | null;
  item_type: string | null;
  publisher_id: string | null;
  publisher: string | null;
  supplier: string | null;
  supply_type: string | null;
  sup_type: string | null;
  created_by: string | null;
  edited_by: string | null;
  cost: string | null;
  currency: string | null;
  create_date: string | null;
  location_title: string | null;
  location: string | null;
  user_cid: string | null;
  print_status: string | null;
  init_status: string | null;
  status: string | null;
  act_type: string | null;
  act_type_title: string | null;
  act_no: string | null;
  count: string | null;
  issue_date: string | null;
  issue_name: string | null;
  issue_num: string | null;
  receive_date: string | null;
  received: string | null;
  received_user: string | null;
  pps: string | null;
};

export type ItemsGetResponse = {
  res: {
    data: AcquisitionItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: string[];
};