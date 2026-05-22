export type BatchUpdateRequest = {
  batch_id: number | string;
  invoice_date: string;
  items_no: number | null;
  titles_no: number | null;
  doc_no: string;
  sup_type: string;
  sup_id: number | null;
  contract_no: string;
  invoice_details: string;
  cost: number | null;
};

export type BatchUpdateResponse = {
  res: { id: number };
};
