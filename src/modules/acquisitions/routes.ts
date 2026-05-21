import { RouteNames, type AppRouteRecordRaw } from "@/application/router";

export const acquisitionRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin/acquisition",
    name: RouteNames.ACQUISITION,
    component: () => import("@/application/layouts/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "Acquisition" },
    redirect: { name: RouteNames.ACQUISITION_ACTS },
    children: [
      {
        path: "acts",
        name: RouteNames.ACQUISITION_ACTS,
        component: () => import("@/modules/acquisitions/pages/acts/search/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Acts",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.acts", link: "/admin/acquisition/acts" },
          ],
        },
      },
      {
        path: "acts/manage/:id?",
        name: RouteNames.ACQUISITION_ACTS + "-manage",
        component: () => import("@/modules/acquisitions/pages/acts/manage/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Manage Act",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.acts", link: "/admin/acquisition/acts" },
            { name: "acquisitions.manage", link: "" },
          ],
        },
      },
      {
        path: "batches",
        name: RouteNames.ACQUISITION_BATCHES,
        component: () => import("@/modules/acquisitions/pages/batches/search/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Batches",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.batches", link: "/admin/acquisition/batches" },
          ],
        },
      },
      {
        path: "batches/manage/:id?",
        name: RouteNames.ACQUISITION_BATCHES + "-manage",
        component: () => import("@/modules/acquisitions/pages/batches/manage/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Manage Batch",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.batches", link: "/admin/acquisition/batches" },
            { name: "acquisitions.manage", link: "" },
          ],
        },
      },
      {
        path: "items",
        name: RouteNames.ACQUISITION_ITEMS,
        component: () => import("@/modules/acquisitions/pages/items/search/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Items",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.items", link: "/admin/acquisition/items" },
          ],
        },
      },
      {
        path: "suppliers",
        name: RouteNames.ACQUISITION_SUPPLIERS,
        component: () => import("@/modules/acquisitions/pages/suppliers/search/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Suppliers",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.suppliers", link: "/admin/acquisition/suppliers" },
          ],
        },
      },
      {
        path: "suppliers/manage/:id?",
        name: RouteNames.ACQUISITION_SUPPLIERS + "-manage",
        component: () => import("@/modules/acquisitions/pages/suppliers/manage/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Manage Supplier",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.suppliers", link: "/admin/acquisition/suppliers" },
            { name: "acquisitions.manage", link: "" },
          ],
        },
      },
      {
        path: "publishers",
        name: RouteNames.ACQUISITION_PUBLISHERS,
        component: () => import("@/modules/acquisitions/pages/publishers/search/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Publishers",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.publishers", link: "/admin/acquisition/publishers" },
          ],
        },
      },
      {
        path: "publishers/manage/:id?",
        name: RouteNames.ACQUISITION_PUBLISHERS + "-manage",
        component: () => import("@/modules/acquisitions/pages/publishers/manage/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Manage Publisher",
          breadcrumbs: [
            { name: "acquisitions.title", link: "/admin/acquisition" },
            { name: "acquisitions.publishers", link: "/admin/acquisition/publishers" },
            { name: "acquisitions.manage", link: "" },
          ],
        },
      },
    ],
  },
];
