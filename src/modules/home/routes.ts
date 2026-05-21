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
  {
    path: "/all-arrivals",
    name: RouteNames.HOME_ARRIVALS,
    component: () => import("@/modules/home/pages/arrivals/Page.vue"),
    meta: {
      layout: "public",
      title: "New Arrivals",
    },
  },
  {
    path: "/all-events",
    name: RouteNames.HOME_EVENTS,
    component: () => import("@/modules/home/pages/events/Page.vue"),
    meta: {
      layout: "public",
      title: "All Events",
    },
  },
  {
    path: "/my-books",
    name: RouteNames.WEBSITE_MY_BOOKS,
    component: () => import("@/modules/home/pages/my-books/Page.vue"),
    meta: {
      layout: "public",
      title: "My Books",
    },
  },
];