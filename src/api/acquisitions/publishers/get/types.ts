export type PublishersGetRequest = {
  add_options?: Array<{ key: string; value: string }>;
  order?: { key: string; mode: "asc" | "desc" };
  page?: number;
  per_page?: number;
};

export type Publisher = {
  id: number;
  name: string | null;
  com_name: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  fax: string | null;
};

export type PublishersGetResponse = {
  res: {
    data: Publisher[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};