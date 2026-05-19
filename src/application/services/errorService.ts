import type { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface DevError extends Error {
  name: "DevError";
}

export class DevError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DevError";
  }
}

export function normalizeError(error: unknown, fallback = "Unexpected error"): string {
  if (!error) return fallback;

  const axiosError = error as AxiosError<ApiErrorBody>;
  if (axiosError.isAxiosError) {
    if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message?.includes("timeout")
    ) {
      return "Request timed out. Please try again.";
    }

    if (!axiosError.response) {
      return "Network error. Check your connection.";
    }

    const data = axiosError.response.data;

    if (data?.message) return data.message;

    if (data?.errors) {
      const firstField = Object.values(data.errors)[0];
      if (firstField?.[0]) return firstField[0];
    }

    const status = axiosError.response.status;
    if (status === 403) return "You do not have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status >= 500) return "A server error occurred. Please try again later.";

    return axiosError.message ?? fallback;
  }

  if (error instanceof Error) return error.message;

  if (typeof error === "string") return error;

  return fallback;
}

export function isHttpError(error: unknown, status: number): boolean {
  const axiosError = error as AxiosError;
  return axiosError?.isAxiosError === true && axiosError.response?.status === status;
}

export const errorService = { normalizeError, isHttpError } as const;