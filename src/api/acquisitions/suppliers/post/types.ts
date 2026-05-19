export type SupplierCreateRequest = {
  sup_name: string;
  bin?: string;
  com_name?: string;
  address?: string;
  email?: string;
  fax?: string;
  phone?: string;
};

export type SupplierCreateResponse = {
  res: { id: number };
};