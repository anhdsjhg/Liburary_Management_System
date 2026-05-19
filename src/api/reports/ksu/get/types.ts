export type KsuReportRequest = {
  from?: string;
  to?: string;
  oneLined?: boolean;
  specialities?: string[];
  supply_type?: string;
  pps?: boolean;
  page?: number;
  per_page?: number;
};

export type KsuReportRow = {
  total_titles: number;
  total_items: number;
  total_price: number;
  in_balance_titles: number;
  in_balance_items: number;
  in_balance_price: number;
  not_in_balance_titles: number;
  not_in_balance_items: number;
  not_in_balance_price: number;
  ru_lang_materials: number;
  kz_lang_materials: number;
  other_lang_materials: number;
  null_lang: number;
  sct_total_items: number;
  sct_total_titles: number;
  txb_total_items: number;
  txb_total_titles: number;
  fic_total_items: number;
  fic_total_titles: number;
  doc_year?: string;
  batch_id?: string | number;
  supplier?: string;
  invoice_date?: string;
  [key: string]: unknown;
};

export type KsuReportResponse = {
  res: {
    data: KsuReportRow[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};