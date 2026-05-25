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
    | "pps"
    | "language";
  value: string | string[];
};

export type CatalogingSearchRequest = {
  add_options: CatalogingSearchAddOption[];
  search_options: Array<{ key: string; operator: string; value: string }>;
  page?: number;
  per_page?: number;
};

export type CatalogingMaterial = {
  id: string;
  title: string;
  author: string | null;
  isbn: string | null;
  issn: string | null;
  call_number: string | null;
  type: string;
  type_key: string;
  genre: string | null;
  language: string | null;
  language_title: string | null;
  state: string | null;
  status: string | null;
  image: string | null;
  pps: string | null;
  publisher: string | null;
  year: string | null;
  city: string | null;
  volume: string | null;
  available: string | null;
  location: string | null;
  prog_code: string | null;
  isnewarrival: string | null;
};

export type CatalogingSearchResponse = {
  res: {
    data: CatalogingMaterial[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  all: string[];
};
