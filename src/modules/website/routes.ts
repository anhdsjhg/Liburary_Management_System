import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const websiteRoutes: AppRouteRecordRaw[] = [
  {
    path: "/",
    name: RouteNames.WEBSITE,
    component: () => import("@/application/layouts/public/PublicLayout.vue"),
    children: [
      {
        path: "events",
        name: RouteNames.WEBSITE_EVENTS,
        component: () =>
          import("@/modules/website/pages/events/search/Page.vue"),
        meta: { title: "Events" },
      },
      {
        path: "events/:id",
        name: RouteNames.WEBSITE_EVENT_DETAIL,
        component: () =>
          import("@/modules/website/pages/events/[id]/Page.vue"),
        meta: { title: "Event" },
      },
      {
        path: "announcements",
        name: RouteNames.WEBSITE_EVENTS,
        component: () =>
          import("@/modules/website/pages/announcements/search/Page.vue"),
        meta: { title: "Announcements" },
      },
      {
        path: "announcements/:id",
        name: RouteNames.WEBSITE_EVENT_DETAIL,
        component: () =>
          import("@/modules/website/pages/announcements/[id]/Page.vue"),
        meta: { title: "Announcement" },
      },
      {
        path: "arrivals",
        name: RouteNames.WEBSITE_ARRIVALS,
        component: () =>
          import("@/modules/website/pages/arrivals/index/Page.vue"),
        meta: { title: "New Arrivals" },
      },
      {
        path: "quick-links",
        name: RouteNames.WEBSITE_MY_BOOKS,
        component: () =>
          import("@/modules/website/pages/quick-links/index/Page.vue"),
        meta: { title: "Quick Links" },
      },
    ],
  },
];