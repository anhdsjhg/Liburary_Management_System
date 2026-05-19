export type SuppliersGetRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type Supplier = {
  id: number;
  name: string | null;
  com_name: string | null;
  bin: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  fax: string | null;
};

export type SuppliersGetResponse = {
  res: {
    data: Supplier[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};