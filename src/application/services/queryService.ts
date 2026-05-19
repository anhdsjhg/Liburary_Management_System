import type { QueryClient } from "@tanstack/vue-query";
import { normalizeError } from "./errorService";
import { showErrorToast } from "./toastService";

let _queryClient: QueryClient | null = null;

function install(client: QueryClient): void {
  _queryClient = client;
}

function getClient(): QueryClient {
  if (!_queryClient) {
    throw new Error("[queryService] QueryClient not installed. Call queryService.install(client).");
  }
  return _queryClient;
}

function handleError(error: unknown): void {
  const message = normalizeError(error);
  showErrorToast(message);
}

async function invalidate(queryKey: readonly unknown[]): Promise<void> {
  await getClient().invalidateQueries({ queryKey });
}

function remove(queryKey: readonly unknown[]): void {
  getClient().removeQueries({ queryKey });
}

function setData<T>(queryKey: readonly unknown[], data: T): void {
  getClient().setQueryData(queryKey, data);
}

function getData<T>(queryKey: readonly unknown[]): T | undefined {
  return getClient().getQueryData<T>(queryKey);
}

export const queryService = {
  install,
  getClient,
  handleError,
  invalidate,
  remove,
  setData,
  getData,
} as const;