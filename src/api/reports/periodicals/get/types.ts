export type PeriodicalsRequest = {
  from?: string;
  to?: string;
  mode?: "oneLined" | "byBatch" | "total";
  supply_type?: string;
  title?: string;
  page?: number;
  per_page?: number;
};

export type PeriodicalItem = {
  journal_id?: number;
  j_issue_id?: number;
  batch_id?: number | string;
  title?: string;
  author?: string;
  publisher?: string;
  pub_city?: string;
  pub_year?: number;
  cost?: number;
  count?: number;
  issue_date?: string;
  issue_num?: number;
  total_titles?: number;
  total_items?: number;
  total_price?: number;
  doc_year?: string;
  supplier?: string;
  [key: string]: unknown;
};

export type PeriodicalsResponse = {
  res: {
    data: PeriodicalItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};