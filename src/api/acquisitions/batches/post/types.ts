import { z } from "zod";

export const batchCreateSchema = z.object({
  invoice_date: z.string({ error: "validation.required" }).min(1, "validation.required"),
  doc_no: z.string({ error: "validation.required" }).min(1, "validation.required"),
  cost: z.number({ error: "validation.required" }).min(0),
  titles_no: z.number({ error: "validation.required" }).min(0),
  items_no: z.number({ error: "validation.required" }).min(0),
  sup_type: z.string().optional(),
  sup_id: z.number().nullable().optional(),
  contract_no: z.string().optional(),
  invoice_details: z.string().optional(),
  custom_id: z.number().nullable().optional(),
});

export type BatchCreateRequest = {
  invoice_date: string;
  items_no?: number;
  titles_no?: number;
  doc_no?: string;
  sup_type?: string;
  sup_id?: number;
  contract_no?: string;
  invoice_details?: string;
  cost?: number;
  custom_id?: number;
};

export type BatchCreateResponse = {
  res: { id: number };
};
