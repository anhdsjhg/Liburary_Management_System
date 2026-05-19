export type BarcodeSearchRequest = {
  add_options?: Array<{ key: string; value: string | Record<string, string> }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type BarcodeItem = {
  id: string;
  barcode: string;
  title: string;
  author: string | null;
  inv_id: string;
  print_status: string;
  init_status: string;
  location: string | null;
  location_title: string | null;
  item_type: string | null;
  supplier: string | null;
  batch_id: number | null;
};

export type BarcodeSearchResponse = {
  res: {
    data: BarcodeItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: string[];
};