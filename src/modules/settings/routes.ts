import { RouteNames } from "@/application/router/routeNames";
import type { AppRouteRecordRaw } from "@/application/router";

export const settingsRoutes: AppRouteRecordRaw[] = [
  {
    path: "/settings",
    name: RouteNames.SETTINGS,
    component: { template: '<router-view />' },
    meta: { requiresAuth: true, layout: 'admin', title: "Settings" },
    redirect: { name: RouteNames.SETTINGS_ANNOUNCEMENTS },
    children: [
      {
        path: "announcements",
        name: RouteNames.SETTINGS_ANNOUNCEMENTS,
        component: () => import("@/modules/settings/pages/announcements/search/Page.vue"),
        meta: { requiresAuth: true, permissions: ["settings.announcements"], layout: 'admin', title: "Announcements" },
      },
      {
        path: "announcements/manage/:id?",
        name: RouteNames.SETTINGS_ANNOUNCEMENTS_MANAGE,
        component: () => import("@/modules/settings/pages/announcements/manage/Page.vue"),
        meta: { requiresAuth: true, permissions: ["settings.announcements"], layout: 'admin', title: "Manage Announcement" },
      },
      {
        path: "videos",
        name: RouteNames.SETTINGS_VIDEOS,
        component: () => import("@/modules/settings/pages/video-content/search/Page.vue"),
        meta: { requiresAuth: true, permissions: ["settings.videos"], layout: 'admin', title: "Videos" },
      },
      {
        path: "arrivals",
        name: RouteNames.SETTINGS_ARRIVALS,
        component: () => import("@/modules/settings/pages/arrivals/search/Page.vue"),
        meta: { requiresAuth: true, permissions: ["settings.arrivals"], layout: 'admin', title: "Arrivals" },
      },
      {
        path: "background-image",
        name: RouteNames.SETTINGS_BACKGROUND_IMAGE,
        component: () => import("@/modules/settings/pages/background-image/Page.vue"),
        meta: { requiresAuth: true, permissions: ["settings.background_image"], layout: 'admin', title: "Background Image" },
      },
      {
        path: "quick-links",
        name: RouteNames.SETTINGS_QUICK_LINKS,
        component: () => import("@/modules/settings/pages/quick-links/search/Page.vue"),
        meta: { requiresAuth: true, permissions: ["settings.quick_links"], layout: 'admin', title: "Quick Links" },
      },
      {
        path: "configuration",
        name: RouteNames.SETTINGS_CONFIGURATION,
        component: () => import("@/modules/settings/pages/announcements/search/Page.vue"),
        meta: { requiresAuth: true, adminOnly: true, layout: 'admin', title: "Configuration" },
      },
    ],
  },
];