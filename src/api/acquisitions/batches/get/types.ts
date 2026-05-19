export type BatchesGetRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type Batch = {
  id: number;
  status_key: number | null;
  status: string | null;
  invoice_date: string | null;
  sup_type: string | null;
  sup_key: string | null;
  supplier: string | null;
  sup_id: number | null;
  titles_no: number | null;
  items_no: number | null;
  titles_ma: number | null;
  items_ma: number | null;
  price: number | null;
  currency: string | null;
  doc_no: string | null;
  contract_no: string | null;
  invoice_details: string | null;
  create_date: string | null;
  edit_date: string | null;
  cost: number | null;
  created_by: string | null;
  edited_by: string | null;
};

export type BatchesGetResponse = {
  res: {
    data: Batch[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};