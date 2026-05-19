export type NotFoundBooksRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type NotFoundBook = {
  id: string;
  barcode: string | null;
  title: string | null;
  author: string | null;
  location: string | null;
  item_type: string | null;
  status: number | null;
  batch_id: number | null;
};

export type NotFoundBooksResponse = {
  res: {
    data: NotFoundBook[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: string[];
};