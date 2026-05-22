import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const reportsRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin/reports",
    name: RouteNames.REPORTS,
    component: () => import("@/application/layouts/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "Reports" },
    redirect: { name: RouteNames.REPORTS_INVENTORY_BOOKS },
    children: [
      {
        path: "attendance",
        name: RouteNames.REPORTS_ATTENDANCE,
        component: () => import("@/modules/reports/pages/attendance/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Attendance",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.attendance", link: "/admin/reports/attendance" },
          ],
        },
      },
      {
        path: "barcode",
        name: RouteNames.REPORTS_BARCODE,
        component: () => import("@/modules/reports/pages/barcode/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Barcode",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.barcode", link: "/admin/reports/barcode" },
          ],
        },
      },
      {
        path: "book-history",
        name: RouteNames.REPORTS_BOOK_HISTORY,
        component: () => import("@/modules/reports/pages/book-history/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Book History",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.book_history", link: "/admin/reports/book-history" },
          ],
        },
      },
      {
        path: "most-read",
        name: RouteNames.REPORTS_MOST_READ,
        component: () => import("@/modules/reports/pages/most-read-books/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Most Read Books",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.most_read", link: "/admin/reports/most-read" },
          ],
        },
      },
      {
        path: "inventory-books",
        name: RouteNames.REPORTS_INVENTORY_BOOKS,
        component: () => import("@/modules/reports/pages/inventory-books/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Inventory Books",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.inventory_books", link: "/admin/reports/inventory-books" },
          ],
        },
      },
      {
        path: "not-found-books",
        name: RouteNames.REPORTS_NOT_FOUND_BOOKS,
        component: () => import("@/modules/reports/pages/not-found-books/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Not Found Books",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.not_found_books", link: "/admin/reports/not-found-books" },
          ],
        },
      },
      {
        path: "ksu",
        name: RouteNames.REPORTS_KSU,
        component: () => import("@/modules/reports/pages/ksu/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "KSU Report",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.ksu", link: "/admin/reports/ksu" },
          ],
        },
      },
      {
        path: "form2",
        name: RouteNames.REPORTS_FORM2,
        component: () => import("@/modules/reports/pages/ksu/components/form2/Form2.vue"),
        meta: {
          requiresAuth: true,
          title: "Form 2",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.form2", link: "/admin/reports/form2" },
          ],
        },
      },
      {
        path: "periodicals",
        name: RouteNames.REPORTS_PERIODICALS,
        component: () => import("@/modules/reports/pages/periodicals/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Periodicals",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.periodicals", link: "/admin/reports/periodicals" },
          ],
        },
      },
      {
        path: "shelves",
        name: RouteNames.REPORTS_SHELVES,
        component: () => import("@/modules/reports/pages/shelves/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Shelves",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.shelves", link: "/admin/reports/shelves" },
          ],
        },
      },
      {
        path: "stat",
        name: RouteNames.REPORTS_STAT,
        component: () => import("@/modules/reports/pages/service-desk-report/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Statistics",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.stat", link: "/admin/reports/stat" },
          ],
        },
      },
      {
        path: "cataloging",
        name: RouteNames.REPORTS_CATALOGING,
        component: () => import("@/modules/reports/pages/cataloging-report/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Cataloging Report",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.cataloging", link: "/admin/reports/cataloging" },
          ],
        },
      },
      {
        path: "dynamic",
        name: RouteNames.REPORTS_DYNAMIC,
        component: () => import("@/modules/reports/pages/dynamic/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Dynamic Reports",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.dynamic", link: "/admin/reports/dynamic" },
          ],
        },
      },
      {
        path: "dynamic/:reportId",
        name: RouteNames.REPORTS_DYNAMIC_DETAIL,
        component: () => import("@/modules/reports/pages/dynamic/[reportId]/Page.vue"),
        meta: {
          requiresAuth: true,
          title: "Dynamic Report Detail",
          breadcrumbs: [
            { name: "reports.title", link: "/admin/reports" },
            { name: "reports.dynamic", link: "/admin/reports/dynamic" },
            { name: "reports.dynamic_detail", link: "" },
          ],
        },
      },
    ],
  },
];
