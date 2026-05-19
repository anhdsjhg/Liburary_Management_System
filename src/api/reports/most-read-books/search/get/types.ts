export type MostReadBooksRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type MostReadBook = {
  id: number;
  title: string | null;
  author: string | null;
  isbn: string | null;
  type: string | null;
  borrow_count: number;
  available: number | null;
  total: number | null;
};

export type MostReadBooksResponse = {
  res: {
    data: MostReadBook[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: number[];
};