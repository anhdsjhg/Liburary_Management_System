import { RouteNames } from "@/application/router/routeNames";
import { EPermissions } from "@/application/enums/permissions";
import type { AppRouteRecordRaw } from "@/application/router";

export const serviceDeskRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin/service-desk",
    name: RouteNames.SERVICE_DESK,
    component: () => import("@/application/layouts/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "Service Desk", permissions: [EPermissions.serviceDesk] },
    redirect: { name: RouteNames.SERVICE_DESK_USERS },
    children: [
      {
        path: "users",
        name: RouteNames.SERVICE_DESK_USERS,
        component: () => import("@/modules/service-desk/pages/users/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Users",
          breadcrumbs: [
            { name: "serviceDesk.title", link: "/admin/service-desk" },
            { name: "serviceDesk.users", link: "/admin/service-desk/users" },
          ],
        },
      },
      {
        path: "shelves",
        name: RouteNames.SERVICE_DESK_SHELVES,
        component: () => import("@/modules/service-desk/pages/shelves/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Shelves",
          breadcrumbs: [
            { name: "serviceDesk.title", link: "/admin/service-desk" },
            { name: "serviceDesk.shelves", link: "/admin/service-desk/shelves" },
          ],
        },
      },
      {
        path: "book-history",
        name: RouteNames.SERVICE_DESK_BOOK_HISTORY,
        component: () => import("@/modules/service-desk/pages/book-history/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Book History",
          breadcrumbs: [
            { name: "serviceDesk.title", link: "/admin/service-desk" },
            { name: "serviceDesk.book_history", link: "/admin/service-desk/book-history" },
          ],
        },
      },
    ],
  },
];