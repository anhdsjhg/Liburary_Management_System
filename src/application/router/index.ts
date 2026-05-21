import {
  createRouter,
  createWebHistory,
  type Router,
} from "vue-router";

import { catalogingRoutes } from "@/modules/cataloging/routes";

import { authGuard } from "./guards/auth.guard";
import { guestGuard } from "./guards/guest.guard";
import { permissionGuard } from "./guards/permission.guard";
import { adminGuard } from "./guards/admin.guard";
import { acquisitionRoutes } from "@/modules/acquisitions/routes";
import { websiteRoutes } from "@/modules/website/routes";
import { reportsRoutes } from "@/modules/reports/routes";
import { serviceDeskRoutes } from "@/modules/service-desk/routes";
import { settingsRoutes } from "@/modules/settings/routes";
import { adminRoutes } from "@/modules/admin/routes";
import { homeRoutes } from "@/modules/home/routes";
import ForbiddenPage from "@/application/components/errors/ForbiddenPage.vue";
import NotFoundPage from "@/application/components/errors/NotFoundPage.vue";
import { RouteNames } from "@/application/router/routeNames";

export type { AppRouteMeta, AppRouteRecordRaw } from "./types/route-meta.types";
export { RouteNames } from "@/application/router/routeNames"

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    ...homeRoutes,
    ...websiteRoutes,
    ...acquisitionRoutes,
    ...catalogingRoutes,
    ...reportsRoutes,
    ...serviceDeskRoutes,
    ...settingsRoutes,
    ...adminRoutes,
    { path: "/403", name: RouteNames.FORBIDDEN, component: ForbiddenPage, meta: { layout: "public" } },
    { path: "/:pathMatch(.*)*", name: RouteNames.NOT_FOUND, component: NotFoundPage, meta: { layout: "public" } },
  ],
});

router.beforeEach(guestGuard);
router.beforeEach(authGuard);
router.beforeEach(adminGuard);
router.beforeEach(permissionGuard);

router.afterEach((to) => {
  const title = to.meta.title;
  document.title = title ? `${title} — SDU Library` : "SDU Library";
});

export default router;