export type SupplierUpdateRequest = {
  sup_id: number | string;
  sup_name?: string;
  bin?: string;
  com_name?: string;
  address?: string;
  email?: string;
  fax?: string;
  phone?: string;
};

export type SupplierUpdateResponse = {
  res: { id: number };
};