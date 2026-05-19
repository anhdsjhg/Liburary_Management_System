import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const serviceDeskRoutes: AppRouteRecordRaw[] = [
  {
    path: "/service-desk",
    name: RouteNames.SERVICE_DESK,
    component: { template: '<router-view />' },
    meta: { requiresAuth: true, layout: 'admin', title: "Service Desk" },
    redirect: { name: RouteNames.SERVICE_DESK_USERS },
    children: [
      {
        path: "users",
        name: RouteNames.SERVICE_DESK_USERS,
        component: () =>
          import("@/modules/service-desk/pages/users/Page.vue"),
        meta: { requiresAuth: true, title: "Users", layout: 'admin' },
      },
      {
        path: "service",
        name: RouteNames.SERVICE_DESK_SERVICE,
        component: () =>
          import("@/modules/service-desk/pages/service/Page.vue"),
        meta: { requiresAuth: true, title: "Service" , layout: 'admin' },
      },
    ],
  },
];