import {
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from "@tanstack/vue-query";
import type { AxiosError } from "axios";
import type { App } from "vue";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

const vueQueryConfig: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,

        retry: (failureCount, error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          if (axiosError.code === "ECONNABORTED" && failureCount < 2)
            return true;
          return false;
        },

        experimental_prefetchInRender: true,
      },

      mutations: {
        onError: (error) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
        },

        onSuccess: () => {
        },
      },
    },
  },
};

export function installVueQuery(app: App): void {
  app.use(VueQueryPlugin, vueQueryConfig);
}

export const QUERY_STALE_TIME = {
  REFERENCE: 10 * 60 * 1000,
  REPORTS: 5 * 60 * 1000,
  SEARCH: 2 * 60 * 1000,
  USER_DATA: 60 * 1000,
  REALTIME: 0,
} as const;