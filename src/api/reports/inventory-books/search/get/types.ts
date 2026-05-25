export type InventoryBooksSearchRequest = {
  add_options?: Array<{ key: string; value: string }>;
  search_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type InventoryBook = {
  id: string;
  inventory_no: string | null;
  invoice_date: string | null;
  lost_status: string | null;
  author_title: string | null;
  batch_id: string | null;
  callnumber: string | null;
  cost: string | null;
  doc_no: string | null;
  location: string | null;
  year_city: string | null;
};

export type InventoryBooksSearchResponse = {
  res: {
    data: InventoryBook[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: string[];
};