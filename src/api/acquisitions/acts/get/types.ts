export type ActsGetRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type Act = {
  id: number;
  act_date: string | null;
  protocol_id: string | null;
  protocol_date: string | null;
  status: string | null;
  notes: string | null;
  create_date: string | null;
  items_ma: number | null;
  price: number | null;
  currency: string | null;
};

export type ActsGetResponse = {
  res: {
    data: Act[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};