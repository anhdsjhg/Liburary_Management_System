import { z } from "zod";

export const actCreateSchema = z.object({
  act_date: z.string({ error: "validation.required" }).min(1, "validation.required"),
  protocol_id: z.string().optional(),
  protocol_date: z.string().optional(),
  notes: z.string().optional(),
  custom_id: z.number().nullable().optional(),
});

export type ActCreateRequest = {
  act_date: string;
  protocol_id?: string;
  protocol_date?: string;
  notes?: string;
  custom_id?: number;
};

export type ActCreateResponse = {
  res: { id: number };
};
