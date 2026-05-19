import { RouteNames, type AppRouteRecordRaw } from "@/application/router";

export const acquisitionRoutes: AppRouteRecordRaw[] = [
  {
    path: "/acquisition",
    name: RouteNames.ACQUISITION,
    component: () => import("@/application/layouts/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "Acquisition" },
    redirect: { name: RouteNames.ACQUISITION_ACTS },
    children: [
      {
        path: "acts",
        name: RouteNames.ACQUISITION_ACTS,
        component: () => import("@/modules/acquisitions/pages/acts/search/Page.vue"),
        meta: { requiresAuth: true, title: "Acts" },
      },
      {
        path: "acts/manage/:id?",
        name: RouteNames.ACQUISITION_ACTS + "-manage",
        component: () => import("@/modules/acquisitions/pages/acts/manage/Page.vue"),
        meta: { requiresAuth: true, title: "Manage Act" },
      },
      {
        path: "batches",
        name: RouteNames.ACQUISITION_BATCHES,
        component: () => import("@/modules/acquisitions/pages/batches/search/Page.vue"),
        meta: { requiresAuth: true, title: "Batches" },
      },
      {
        path: "batches/manage/:id?",
        name: RouteNames.ACQUISITION_BATCHES + "-manage",
        component: () => import("@/modules/acquisitions/pages/batches/manage/Page.vue"),
        meta: { requiresAuth: true, title: "Manage Batch" },
      },
      {
        path: "items",
        name: RouteNames.ACQUISITION_ITEMS,
        component: () => import("@/modules/acquisitions/pages/items/search/Page.vue"),
        meta: { requiresAuth: true, title: "Items" },
      },
      {
        path: "suppliers",
        name: RouteNames.ACQUISITION_SUPPLIERS,
        component: () => import("@/modules/acquisitions/pages/suppliers/search/Page.vue"),
        meta: { requiresAuth: true, title: "Suppliers" },
      },
      {
        path: "suppliers/manage/:id?",
        name: RouteNames.ACQUISITION_SUPPLIERS + "-manage",
        component: () => import("@/modules/acquisitions/pages/suppliers/manage/Page.vue"),
        meta: { requiresAuth: true, title: "Manage Supplier" },
      },
      {
        path: "publishers",
        name: RouteNames.ACQUISITION_PUBLISHERS,
        component: () => import("@/modules/acquisitions/pages/publishers/search/Page.vue"),
        meta: { requiresAuth: true, title: "Publishers" },
      },
      {
        path: "publishers/manage/:id?",
        name: RouteNames.ACQUISITION_PUBLISHERS + "-manage",
        component: () => import("@/modules/acquisitions/pages/publishers/manage/Page.vue"),
        meta: { requiresAuth: true, title: "Manage Publisher" },
      },
    ],
  },
];