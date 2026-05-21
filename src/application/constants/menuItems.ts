import type { MenuItem } from "primevue/menuitem";
import { ref } from "vue";
import { EPermissions } from "@/application/enums/permissions";

export type AppMenuItemType = MenuItem & {
  permission?: EPermissions;
  requiresAuth?: boolean;
  items?: AppMenuItemType[];
};

export const menuItems = ref<AppMenuItemType[]>([
  {
    label: "defaultLayout.sidebar.serviceDesk.title",
    icon: "pi pi-desktop",
    permission: EPermissions.serviceDesk,
    items: [
      {
        label: "defaultLayout.sidebar.serviceDesk.users",
        icon: "pi pi-users",
        to: "/admin/service-desk/users",
      },
      {
        label: "defaultLayout.sidebar.serviceDesk.shelves",
        icon: "pi pi-shelf",
        to: "/admin/service-desk/shelves",
      },
      {
        label: "defaultLayout.sidebar.serviceDesk.bookHistory",
        icon: "pi pi-history",
        to: "/admin/service-desk/book-history",
      },
    ],
  },
  {
    label: "defaultLayout.sidebar.cataloging.title",
    icon: "pi pi-book",
    permission: EPermissions.cataloging,
    items: [
      {
        label: "defaultLayout.sidebar.cataloging.search",
        icon: "pi pi-search",
        to: "/admin/cataloging/search",
      },
    ],
  },
  {
    label: "defaultLayout.sidebar.acquisitions.title",
    icon: "pi pi-shopping-cart",
    permission: EPermissions.batches,
    items: [
      {
        label: "defaultLayout.sidebar.acquisitions.batches",
        icon: "pi pi-inbox",
        to: "/admin/acquisition/batches",
      },
      {
        label: "defaultLayout.sidebar.acquisitions.acts",
        icon: "pi pi-file",
        to: "/admin/acquisition/acts",
      },
      {
        label: "defaultLayout.sidebar.acquisitions.items",
        icon: "pi pi-list",
        to: "/admin/acquisition/items",
      },
      {
        label: "defaultLayout.sidebar.acquisitions.publishers",
        icon: "pi pi-building",
        to: "/admin/acquisition/publishers",
      },
      {
        label: "defaultLayout.sidebar.acquisitions.suppliers",
        icon: "pi pi-truck",
        to: "/admin/acquisition/suppliers",
      },
    ],
  },
  {
    label: "defaultLayout.sidebar.reports.title",
    icon: "pi pi-chart-bar",
    permission: EPermissions.report,
    items: [
      {
        label: "defaultLayout.sidebar.reports.inventoryBooks",
        icon: "pi pi-book",
        to: "/admin/reports/inventory-books",
      },
      {
        label: "defaultLayout.sidebar.reports.periodicals",
        icon: "pi pi-newspaper",
        to: "/admin/reports/periodicals",
      },
      {
        label: "defaultLayout.sidebar.reports.dynamicReports",
        icon: "pi pi-chart-line",
        to: "/admin/reports/dynamic",
      },
    ],
  },
  {
    label: "defaultLayout.sidebar.website.title",
    icon: "pi pi-cog",
    permission: EPermissions.website,
    items: [
      {
        label: "defaultLayout.sidebar.website.announcements",
        icon: "pi pi-megaphone",
        to: "/admin/settings/announcements",
      },
      {
        label: "defaultLayout.sidebar.website.newArrivals",
        icon: "pi pi-box",
        to: "/admin/settings/arrivals",
      },
      {
        label: "defaultLayout.sidebar.website.quickLinks",
        icon: "pi pi-link",
        to: "/admin/settings/quick-links",
      },
      {
        label: "defaultLayout.sidebar.website.videoContent",
        icon: "pi pi-video",
        to: "/admin/settings/videos",
      },
      {
        label: "defaultLayout.sidebar.website.settings",
        icon: "pi pi-cog",
        to: "/admin/settings/background-image",
      },
    ],
  },
]);
