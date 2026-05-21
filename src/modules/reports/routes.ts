import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const reportsRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin/reports",
    name: RouteNames.REPORTS,
    component: { template: '<router-view />' },
    meta: { requiresAuth: true, layout: 'admin', title: "Reports" },
    redirect: { name: RouteNames.REPORTS_ATTENDANCE },
    children: [
      {
        path: "attendance",
        name: RouteNames.REPORTS_ATTENDANCE,
        component: () => import("@/modules/reports/pages/attendance/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.attendance"], layout: 'admin', title: "Attendance" },
      },
      {
        path: "barcode",
        name: RouteNames.REPORTS_BARCODE,
        component: () => import("@/modules/reports/pages/barcode/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.barcode"], layout: 'admin', title: "Barcode" },
      },
      {
        path: "book-history",
        name: RouteNames.REPORTS_BOOK_HISTORY,
        component: () => import("@/modules/reports/pages/book-history/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.book_history"], layout: 'admin', title: "Book History" },
      },
      {
        path: "most-read",
        name: RouteNames.REPORTS_MOST_READ,
        component: () => import("@/modules/reports/pages/most-read-books/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.most_read"], layout: 'admin', title: "Most Read" },
      },
      {
        path: "inventory-books",
        name: RouteNames.REPORTS_INVENTORY_BOOKS,
        component: () => import("@/modules/reports/pages/inventory-books/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.inventory_books"], layout: 'admin', title: "Inventory Books" },
      },
      {
        path: "not-found-books",
        name: RouteNames.REPORTS_NOT_FOUND_BOOKS,
        component: () => import("@/modules/reports/pages/not-found-books/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.not_found_books"], layout: 'admin', title: "Not Found Books" },
      },
      {
        path: "ksu",
        name: RouteNames.REPORTS_KSU,
        component: () => import("@/modules/reports/pages/ksu/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.ksu"], layout: 'admin', title: "KSU Report" },
      },
      {
        path: "form2",
        name: RouteNames.REPORTS_FORM2,
        component: () => import("@/modules/reports/pages/ksu/components/form2/Form2.vue"),
        meta: { requiresAuth: true, permissions: ["reports.form2"], layout: 'admin', title: "Form 2" },
      },
      {
        path: "periodicals",
        name: RouteNames.REPORTS_PERIODICALS,
        component: () => import("@/modules/reports/pages/periodicals/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.periodicals"], layout: 'admin', title: "Periodicals" },
      },
      {
        path: "shelves",
        name: RouteNames.REPORTS_SHELVES,
        component: () => import("@/modules/reports/pages/shelves/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.shelves"], layout: 'admin', title: "Shelves" },
      },
      {
        path: "stat",
        name: RouteNames.REPORTS_STAT,
        component: () => import("@/modules/reports/pages/service-desk-report/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.stat"], layout: 'admin', title: "Stat Report" },
      },
      {
        path: "cataloging-report",
        name: "reports-cataloging",
        component: () => import("@/modules/reports/pages/cataloging-report/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.cataloging"], layout: 'admin', title: "Cataloging Report" },
      },
      {
        path: "dynamic",
        name: RouteNames.REPORTS_DYNAMIC,
        component: () => import("@/modules/reports/pages/dynamic/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.dynamic"], layout: 'admin', title: "Dynamic Reports" },
      },
      {
        path: "dynamic/:reportId",
        name: RouteNames.REPORTS_DYNAMIC_DETAIL,
        component: () => import("@/modules/reports/pages/dynamic/[reportId]/Page.vue"),
        meta: { requiresAuth: true, permissions: ["reports.dynamic"], layout: 'admin', title: "Dynamic Report" },
      },
    ],
  },
];