import { StorageKeys } from "../configs/constants";
import { storageService } from "./storageService";

export interface AuthTokenPayload {
  token: string;
  expiresAt?: number;
}

function getToken(): string | null {
  return storageService.get<string>(StorageKeys.TOKEN);
}

function setToken(payload: AuthTokenPayload): void {
  storageService.set(StorageKeys.TOKEN, payload.token);
}

function clearToken(): void {
  storageService.remove(StorageKeys.TOKEN);
  storageService.remove(StorageKeys.USER);
}

function isAuthenticated(): boolean {
  return getToken() !== null;
}

function redirectToLogin(): void {
  const isAlreadyOnLogin = window.location.pathname.includes("/login");
  if (!isAlreadyOnLogin) {
    window.location.href = "/login";
  }
}

export const authService = {
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
  redirectToLogin,
} as const;