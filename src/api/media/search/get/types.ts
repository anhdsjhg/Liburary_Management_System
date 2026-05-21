export type MediaSearchOption = {
  key: "all" | "title" | "author" | "isbn" | "publisher" | "call_number";
  value: string;
  operator?: "and" | "or" | "not";
};

export type MediaFilterOption = {
  key: string;
  value: string | string[] | { from?: string; to?: string };
};

export type MediaSearchRequest = {
  search_options: MediaSearchOption[];
  filter?: MediaFilterOption[];
  page?: number;
  per_page?: number;
};

export type MediaSearchItem = {
  id: number;
  title: string;
  author: string;
  type: string;
  type_key: string;
  genre?: string;
  isbn?: string;
  year?: number;
  publisher?: string;
  call_number?: string;
  location?: string;
  language?: string;
  available?: number;
  total?: number;
  image?: string;
};

export type MediaSearchResponse = {
  res: {
    data: MediaSearchItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  filter: Record<string, string[]>;
  all: number[];
};