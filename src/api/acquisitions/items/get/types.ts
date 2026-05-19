export type ItemsGetRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type AcquisitionItem = {
  id: string;
  barcode: string | null;
  old_inv_id: string | null;
  batch_id: number | null;
  book_id: number | null;
  journal_id: number | null;
  disc_id: number | null;
  prog_code: string | null;
  title: string | null;
  author: string | null;
  isbn: string | null;
  pub_year: number | null;
  pub_city: string | null;
  item_key: string | null;
  item_type: string | null;
  publisher_id: number | null;
  publisher: string | null;
  supplier: string | null;
  supply_type: string | null;
  sup_type: string | null;
  created_by: string | null;
  edited_by: string | null;
  cost: number | null;
  currency: string | null;
  create_date: string | null;
  location_title: string | null;
  location: string | null;
  user_cid: string | null;
  print_status: string | null;
  init_status: string | null;
  status: number | null;
  act_type: number | null;
  act_type_title: string | null;
  act_no: number | null;
};

export type ItemsGetResponse = {
  res: {
    data: AcquisitionItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};