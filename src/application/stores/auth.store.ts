import { defineStore } from "pinia";
import { storageService } from "@/application/services/storageService";
import { StorageKeys } from "@/application/configs/constants";
import type { AuthLoginResponse, AuthLoginUser } from "@/api/auth/login/post/types";
import type { AuthMeResponse } from "@/api/auth/me/get/types";
import type { EPermissions } from "@/application/enums/permissions";

export type { AuthLoginUser as AuthUser };

interface AuthState {
  user: AuthLoginUser | null;
  token: string | null;
  moduleRouteNames: string[];
  loginVisible: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    moduleRouteNames: [],
    loginVisible: false
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    isAdmin: (state): boolean => state.user?.is_admin === true,
    isEmployee: (state): boolean => state.user?.type === "employee",
    isStudent: (state): boolean => state.user?.type === "student",
    userDisplayName: (state): string => {
      if (!state.user) return "";
      return `${state.user.surname ?? ""} ${state.user.name ?? ""}`.trim();
    },
    hasModule:
      (state) =>
      (routeName: EPermissions): boolean =>
        state.moduleRouteNames.includes(routeName),
  },

  actions: {
    setToken(token: string): void {
      this.token = token;
      storageService.set(StorageKeys.TOKEN, token);
    },

    setUser(user: AuthLoginUser): void {
      this.user = user;
      storageService.set(StorageKeys.USER, user);
    },

    setFromLoginResponse(response: AuthLoginResponse): void {
      this.setToken(response.res.access_token);
      this.setUser(response.res.user);
    },

    setFromMeResponse(response: AuthMeResponse): void {
      this.user = response.res.user;
      storageService.set(StorageKeys.USER, this.user);
    },

    setModules(routeNames: string[]): void {
      this.moduleRouteNames = routeNames;
      storageService.set(StorageKeys.MODULES, routeNames);
    },

    logout(): void {
      this.user = null;
      this.token = null;
      this.moduleRouteNames = [];
      storageService.remove(StorageKeys.TOKEN);
      storageService.remove(StorageKeys.USER);
      storageService.remove(StorageKeys.MODULES);
    },

    hydrate(): void {
      this.token = storageService.get<string>(StorageKeys.TOKEN);
      this.user = storageService.get<AuthLoginUser>(StorageKeys.USER);
      this.moduleRouteNames =
        storageService.get<string[]>(StorageKeys.MODULES) ?? [];
    },
  },
});