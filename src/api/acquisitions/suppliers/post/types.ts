import { z } from "zod";

export const supplierCreateSchema = z.object({
  sup_name: z.string({ error: "validation.required" }).min(1, "validation.required"),
  bin: z.string().optional(),
  com_name: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
  phone: z.string().optional(),
});

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
