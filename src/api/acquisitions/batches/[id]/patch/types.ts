export type BatchUpdateRequest = {
  batch_id: number | string;
  invoice_date?: string;
  items_no?: number;
  titles_no?: number;
  doc_no?: string;
  sup_type?: string;
  sup_id?: number;
  contract_no?: string;
  invoice_details?: string;
  cost?: number;
};

export type BatchUpdateResponse = {
  res: { id: number };
};