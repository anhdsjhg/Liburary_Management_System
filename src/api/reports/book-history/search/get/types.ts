export type BookHistorySearchRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type BookHistoryEntry = {
  id: string;
  barcode: string | null;
  title: string | null;
  author: string | null;
  isbn: string | null;
  inv_id: string;
  batch_id: number | null;
  item_type: string | null;
  supplier: string | null;
  location: string | null;
  location_title: string | null;
  cost: number | null;
  currency: string | null;
  create_date: string | null;
};

export type BookHistorySearchResponse = {
  res: {
    data: BookHistoryEntry[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: string[];
};