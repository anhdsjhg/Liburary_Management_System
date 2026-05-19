export type ShelvesSearchRequest = {
  add_options?: Array<{ key: string; value: string }>;
  page?: number;
  per_page?: number;
};

export type ShelfItem = {
  inv_id: string;
  barcode: string;
  title: string | null;
  callnumber: string | null;
};

export type ShelvesSearchResponse = {
  res: {
    data: ShelfItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: ShelfItem[];
};