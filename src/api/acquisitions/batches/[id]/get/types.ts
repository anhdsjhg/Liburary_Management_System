export type BatchShowResponse = {
  res: {
    id: number;
    status_key: number | null;
    status: string | null;
    invoice_date: string | null;
    sup_type: string | null;
    supplier: string | null;
    sup_id: number | null;
    titles_no: number | null;
    items_no: number | null;
    price: number | null;
    currency: string | null;
    doc_no: string | null;
    contract_no: string | null;
    invoice_details: string | null;
    create_date: string | null;
    edit_date: string | null;
    cost: number | null;
    created_by: string | null;
    edited_by: string | null;
  };
};