import type { NavigationGuard } from "vue-router";
import { useAuthStore } from "@/application/stores/auth.store";
import { RouteNames } from "@/application/router/routeNames";

export const guestGuard: NavigationGuard = (to) => {
  const meta = to.meta;

  if (!meta?.guestOnly) return true;

  const authStore = useAuthStore();

  if (authStore.token) {
    return { name: RouteNames.WEBSITE_HOME };
  }

  return true;
};