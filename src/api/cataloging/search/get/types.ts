export type CatalogingSearchAddOption = {
  key:
    | "query"
    | "type"
    | "state"
    | "inv_id"
    | "sup_key"
    | "prog_code"
    | "genres"
    | "batch_id"
    | "pps";
  value: string | string[];
};

export type CatalogingSearchRequest = {
  add_options: CatalogingSearchAddOption[];
  page?: number;
  per_page?: number;
};

export type CatalogingMaterial = {
  id: number;
  title: string;
  author: string | null;
  isbn: string | null;
  call_number: string | null;
  type: string;
  type_key: string;
  genre: string | null;
  language: string | null;
  state: string | null;
  status: string | null;
  image: string | null;
  pps: string | null;
};

export type CatalogingSearchResponse = {
  res: {
    data: CatalogingMaterial[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: number[];
};