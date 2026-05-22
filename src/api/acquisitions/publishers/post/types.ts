import { z } from "zod";

export const publisherCreateSchema = z.object({
  pub_name: z.string({ error: "validation.required" }).min(1, "validation.required"),
  com_name: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
  phone: z.string().optional(),
});

export type PublisherCreateRequest = {
  pub_name: string;
  com_name?: string;
  address?: string;
  email?: string;
  fax?: string;
  phone?: string;
};

export type PublisherCreateResponse = {
  res: { id: number };
};
