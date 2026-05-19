import type { AppRouteRecordRaw } from "@/application/router/";
import { RouteNames } from "@/application/router/routeNames";

export const homeRoutes: AppRouteRecordRaw[] = [
  {
    path: "/",
    name: RouteNames.WEBSITE_HOME,
    component: () => import("@/modules/home/pages/index/Page.vue"),
    meta: {
      layout: "public",
      title: "Home",
    },
  },
  {
    path: "/search",
    name: RouteNames.WEBSITE_SEARCH,
    component: () => import("@/modules/home/pages/search/Page.vue"),
    meta: {
      layout: "public",
      title: "Search",
    },
  },
  {
    path: "/book/:id",
    name: RouteNames.WEBSITE_BOOK,
    component: () => import("@/modules/home/pages/book/[id]/Page.vue"),
    meta: {
      layout: "public",
      title: "Book",
    },
  },
];