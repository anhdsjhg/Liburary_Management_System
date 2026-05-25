export type BookHistorySearchRequest = {
  add_options?: Array<{ key: string; value: unknown }>;
  search_options?: Array<{ key: string; operator: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type BookHistoryEntry = {
  id: string;
  barcode: string | null;
  type: string | null;
  title: string | null;
  author: string | null;
  borrow_date: string | null;
  due_date: string | null;
  delivery_date: string | null;
  status: string | null;
  user_cid: string | null;
  username: string | null;
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
