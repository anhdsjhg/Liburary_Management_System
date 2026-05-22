import type { NavigationGuard } from "vue-router";
import { useAuthStore } from "@/application/stores/auth.store";
import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteMeta } from "../types/route-meta.types";

export const authGuard: NavigationGuard = (to) => {
  const meta = to.meta as AppRouteMeta;
  if (!meta.requiresAuth) return true;

  const authStore = useAuthStore();

  if (!authStore.token) {
    authStore.loginVisible = true;
    return { name: RouteNames.WEBSITE_HOME };
  }

  return true;
};