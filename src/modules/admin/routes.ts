import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const adminRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin",
    name: RouteNames.ADMIN,
    component: { template: '<router-view />' },
    meta: { requiresAuth: true, adminOnly: true, layout: 'admin', title: "Admin" },
    redirect: { name: RouteNames.ADMIN_PERMISSIONS },
    children: [
      {
        path: "permissions",
        name: RouteNames.ADMIN_PERMISSIONS,
        component: () => import("@/modules/admin/pages/permissions/Page.vue"),
        meta: { requiresAuth: true, adminOnly: true, layout: 'admin', title: "Permissions" },
      },
      {
        path: "control",
        name: RouteNames.ADMIN_CONTROL,
        component: () => import("@/modules/admin/pages/control/Page.vue"),
        meta: { requiresAuth: true, adminOnly: true, layout: 'admin', title: "Control Panel" },
      },
    ],
  },
];