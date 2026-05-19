export type InventoryBooksSearchRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type InventoryBook = {
  id: string;
  barcode: string | null;
  title: string | null;
  author: string | null;
  isbn: string | null;
  pub_year: number | null;
  item_type: string | null;
  publisher: string | null;
  supplier: string | null;
  supply_type: string | null;
  cost: number | null;
  currency: string | null;
  create_date: string | null;
  location_title: string | null;
  location: string | null;
  status: number | null;
  batch_id: number | null;
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