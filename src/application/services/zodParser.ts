import type { ZodTypeAny, ZodError } from "zod";
import { showErrorToast } from "./toastService";

function extractZodMessages(error: ZodError): string {
  return error.issues
    .map((e) => {
      const path = e.path.length > 0 ? `${e.path.join(".")}: ` : "";
      return `${path}${e.message}`;
    })
    .join(" | ");
}

function parse<TSchema extends ZodTypeAny>(
  schema: TSchema,
  data: unknown
): ReturnType<TSchema["parse"]> {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data as ReturnType<TSchema["parse"]>;
  }

  const message = extractZodMessages(result.error);

  showErrorToast(`Validation error: ${message}`, "Data Error");

  throw new Error(`[zodParser] Schema validation failed: ${message}`);
}

async function parseAsync<TSchema extends ZodTypeAny>(
  schema: TSchema,
  data: unknown
): Promise<ReturnType<TSchema["parse"]>> {
  const result = await schema.safeParseAsync(data);

  if (result.success) {
    return result.data as ReturnType<TSchema["parse"]>;
  }

  const message = extractZodMessages(result.error);

  showErrorToast(`Validation error: ${message}`, "Data Error");

  throw new Error(`[zodParser] Async schema validation failed: ${message}`);
}

function safeParse<TSchema extends ZodTypeAny>(
  schema: TSchema,
  data: unknown
): ReturnType<TSchema["parse"]> | null {
  const result = schema.safeParse(data);
  return result.success ? (result.data as ReturnType<TSchema["parse"]>) : null;
}

export const zodParser = { parse, parseAsync, safeParse } as const;