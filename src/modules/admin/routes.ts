import { RouteNames } from "@/application/router/routeNames";
import { EPermissions } from "@/application/enums/permissions";
import type { AppRouteRecordRaw } from "@/application/router";

export const adminRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin",
    name: RouteNames.ADMIN,
    component: () => import("@/application/layouts/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, adminOnly: true, permissions: [EPermissions.admin], title: "Admin" },
    redirect: { name: RouteNames.ADMIN_PERMISSIONS },
    children: [
      {
        path: "permissions",
        name: RouteNames.ADMIN_PERMISSIONS,
        component: () => import("@/modules/admin/pages/permissions/Page.vue"),
        meta: { 
          requiresAuth: true, 
          adminOnly: true, 
          title: "Permissions",
          breadcrumbs: [
            { name: "admin.title", link: "/admin" },
            { name: "admin.permissions", link: "/admin/permissions" },  
          ]
        },
      },
      {
        path: "control/:userId",
        name: RouteNames.ADMIN_CONTROL,
        component: () => import("@/modules/admin/pages/control/Page.vue"),
        meta: { 
          requiresAuth: true, 
          adminOnly: true,
          title: "Control Panel",
          breadcrumbs: [
            { name: "admin.title", link: "/admin" },
            { name: "admin.controlPanel", link: "" },  
          ]
        },
      },
    ],
  },
];