import type { RouteMeta, RouteRecordRaw } from "vue-router";

export interface AppRouteMeta extends RouteMeta {
  requiresAuth?: boolean;
  guestOnly?: boolean;
  permissions?: string[];
  adminOnly?: boolean;
  title?: string;

  layout?: "admin" | "auth" | "empty" | "public";

  breadcrumbs?: TBreadcrumb[];
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: AppRouteMeta;
  children?: AppRouteRecordRaw[];
};

export type TBreadcrumb = {
  name: string;
  link?: string;
};