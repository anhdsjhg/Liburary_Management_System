import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const catalogingRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin/cataloging",
    name: RouteNames.CATALOGING,
    component: () => import("@/application/layouts/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "Cataloging" },
    redirect: { name: RouteNames.CATALOGING_SEARCH },
    children: [
      {
        path: "search",
        name: RouteNames.CATALOGING_SEARCH,
        component: () =>
          import("@/modules/cataloging/pages/search/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Cataloging Search",
          breadcrumbs: [
            { name: "cataloging.title", link: "/admin/cataloging" },
            { name: "cataloging.search", link: "/admin/cataloging/search" },
          ],
        },
      },
      {
        path: "edit/:id",
        name: RouteNames.CATALOGING_EDIT,
        component: () =>
          import("@/modules/cataloging/pages/edit/[id]/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Cataloging Editor",
          breadcrumbs: [
            { name: "cataloging.title", link: "/admin/cataloging" },
            { name: "cataloging.edit", link: "/admin/cataloging/search" },
          ],
        },
      },
    ],
  },
];