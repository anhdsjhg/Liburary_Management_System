import { RouteNames } from "@/application/router/routeNames";
import { EPermissions } from "@/application/enums/permissions";
import type { AppRouteRecordRaw } from "@/application/router";

export const settingsRoutes: AppRouteRecordRaw[] = [
  {
    path: "/admin/settings",
    name: RouteNames.SETTINGS,
    component: () => import("@/application/layouts/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, title: "Settings" },
    redirect: { name: RouteNames.SETTINGS_ANNOUNCEMENTS },
    children: [
      {
        path: "announcements",
        name: RouteNames.SETTINGS_ANNOUNCEMENTS,
        component: () => import("@/modules/settings/pages/announcements/search/Page.vue"),
        meta: { 
          requiresAuth: true, 
          permissions: [EPermissions.website], 
          title: "Announcements",
          breadcrumbs: [
            { name: "settings.title", link: "/admin/settings" },
            { name: "settings.announcements", link: "/admin/settings/announcements" },
          ]
        }
      },
      {
        path: "announcements/manage/:id?",
        name: RouteNames.SETTINGS_ANNOUNCEMENTS_MANAGE,
        component: () => import("@/modules/settings/pages/announcements/manage/Page.vue"),
        meta: { requiresAuth: true, permissions: [EPermissions.website], title: "Manage Announcement", breadcrumbs: [
          { name: "settings.title", link: "/admin/settings" },
          { name: "settings.announcements", link: "/admin/settings/announcements" },
          { name: "settings.announcements.manage", link: "/admin/settings/announcements/manage" }
        ] },
      },
      {
        path: "videos",
        name: RouteNames.SETTINGS_VIDEOS,
        component: () => import("@/modules/settings/pages/video-content/search/Page.vue"),
        meta: { 
          requiresAuth: true, 
          permissions: [EPermissions.website], 
          title: "Videos",
          breadcrumbs: [
            { name: "settings.title", link: "/admin/settings" },
            { name: "settings.videos", link: "/admin/settings/videos" },
          ]
        },
      },
      {
        path: "arrivals",
        name: RouteNames.SETTINGS_ARRIVALS,
        component: () => import("@/modules/settings/pages/arrivals/search/Page.vue"),
        meta: { 
          requiresAuth: true, 
          permissions: [EPermissions.website], 
          title: "Arrivals",
          breadcrumbs: [
            { name: "settings.title", link: "/admin/settings" },
            { name: "settings.arrivals", link: "/admin/settings/arrivals" },
          ]
        },
      },
      {
        path: "background-image",
        name: RouteNames.SETTINGS_BACKGROUND_IMAGE,
        component: () => import("@/modules/settings/pages/background-image/Page.vue"),
        meta: { requiresAuth: true, permissions: [EPermissions.website], title: "Background Image", breadcrumbs: [
          { name: "settings.title", link: "/admin/settings" },
          { name: "settings.background-image", link: "/admin/settings/background-image" }
        ] },
      },
      {
        path: "quick-links",
        name: RouteNames.SETTINGS_QUICK_LINKS,
        component: () => import("@/modules/settings/pages/quick-links/search/Page.vue"),
        meta: { requiresAuth: true, permissions: [EPermissions.website], title: "Quick Links", breadcrumbs: [
          { name: "settings.title", link: "/admin/settings" },
          { name: "settings.quick-links", link: "/admin/settings/quick-links" }
        ] },
      },
      {
        path: "configuration",
        name: RouteNames.SETTINGS_CONFIGURATION,
        component: () => import("@/modules/settings/pages/configuration/Page.vue"),
        meta: { requiresAuth: true, adminOnly: true, layout: 'admin', title: "Configuration", breadcrumbs: [
          { name: "settings.title", link: "/admin/settings" },
          { name: "settings.configuration", link: "/admin/settings/configuration" }
        ] },
      },
    ],
  },
];
