import axiosInstance from "../configs/axios";
import type { AxiosRequestConfig } from "axios";

export interface ApiResponse<T = unknown> {
  res: T;
  message?: string;
}

async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.get<T>(url, config);
  return response.data;
}

async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.post<T>(url, data, config);
  return response.data;
}

async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.put<T>(url, data, config);
  return response.data;
}

async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.patch<T>(url, data, config);
  return response.data;
}

async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.delete<T>(url, config);
  return response.data;
}

async function postBlob(
  url: string,
  data?: unknown
): Promise<Blob> {
  const response = await axiosInstance.post<Blob>(url, data, {
    responseType: "blob",
  });
  return response.data;
}

async function getBlob(
  url: string,
  config?: AxiosRequestConfig
): Promise<Blob> {
  const response = await axiosInstance.get<Blob>(url, {
    ...config,
    responseType: "blob",
  });
  return response.data;
}

export const apiService = {
  get,
  post,
  put,
  patch,
  delete: del,
  postBlob,
  getBlob,
} as const;