import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const catalogingRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin/cataloging",
    name: RouteNames.CATALOGING,
    component: { template: '<router-view />' },
    meta: { requiresAuth: true, layout: 'admin', title: "Cataloging" },
    redirect: { name: RouteNames.CATALOGING_SEARCH },
    children: [
      {
        path: "search",
        name: RouteNames.CATALOGING_SEARCH,
        component: () =>
          import("@/modules/cataloging/pages/search/Page.vue"),
        meta: { requiresAuth: true, layout: 'admin', title: "Cataloging Search" },
      },
      {
        path: "edit/:id",
        name: RouteNames.CATALOGING_EDIT,
        component: () =>
          import("@/modules/cataloging/pages/edit/[id]/Page.vue"),
        meta: { requiresAuth: true, layout: 'admin', title: "Cataloging Editor" },
      },
    ],
  },
];