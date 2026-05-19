/**
 * Centralised route name constants.
 * Use these instead of raw strings everywhere in the app.
 *
 * Naming convention: {domain}-{page}
 */
export enum RouteNames {
  // Auth
  LOGIN = "auth-login",

  // Root / Dashboard
  DASHBOARD = "dashboard",

  // Acquisition
  ACQUISITION = "acquisition",
  ACQUISITION_ACTS = "acquisition-acts",
  ACQUISITION_BATCHES = "acquisition-batches",
  ACQUISITION_ITEMS = "acquisition-items",
  ACQUISITION_SUPPLIERS = "acquisition-suppliers",
  ACQUISITION_PUBLISHERS = "acquisition-publishers",

  // Cataloging
  CATALOGING = "cataloging",
  CATALOGING_SEARCH = "cataloging-search",
  CATALOGING_EDIT = "cataloging-edit",

  // Reports
  REPORTS = "reports",
  REPORTS_ATTENDANCE = "reports-attendance",
  REPORTS_BARCODE = "reports-barcode",
  REPORTS_BOOK_HISTORY = "reports-book-history",
  REPORTS_MOST_READ = "reports-most-read",
  REPORTS_INVENTORY_BOOKS = "reports-inventory-books",
  REPORTS_NOT_FOUND_BOOKS = "reports-not-found-books",
  REPORTS_KSU = "reports-ksu",
  REPORTS_FORM2 = "reports-form2",
  REPORTS_PERIODICALS = "reports-periodicals",
  REPORTS_SHELVES = "reports-shelves",
  REPORTS_STAT = "reports-stat",
  REPORTS_DYNAMIC = "reports-dynamic",
  REPORTS_DYNAMIC_DETAIL = "reports-dynamic-detail",

  // Service Desk
  SERVICE_DESK = "service-desk",
  SERVICE_DESK_USERS = "service-desk-users",
  SERVICE_DESK_SERVICE = "service-desk-service",

  // Settings (CMS)
  SETTINGS = "settings",
  SETTINGS_ANNOUNCEMENTS = "settings-announcements",
  SETTINGS_ANNOUNCEMENTS_MANAGE = "settings-announcements-manage",
  SETTINGS_VIDEOS = "settings-videos",
  SETTINGS_ARRIVALS = "settings-arrivals",
  SETTINGS_BACKGROUND_IMAGE = "settings-background-image",
  SETTINGS_QUICK_LINKS = "settings-quick-links",
  SETTINGS_CONFIGURATION = "settings-configuration",

  // Admin
  ADMIN = "admin",
  ADMIN_PERMISSIONS = "admin-permissions",
  ADMIN_CONTROL = "admin-control",

  // Website (public portal)
  WEBSITE = "website",
  WEBSITE_HOME = "website-home",
  WEBSITE_SEARCH = "website-search",
  WEBSITE_BOOK = "website-book",
  WEBSITE_EVENTS = "website-events",
  WEBSITE_EVENT_DETAIL = "website-event-detail",
  WEBSITE_ARRIVALS = "website-arrivals",
  WEBSITE_MY_BOOKS = "website-my-books",
  WEBSITE_ANNOUNCEMENTS = "website-announcements",
  WEBSITE_ANNOUNCEMENT_DETAIL = "website-announcement-detail",
  WEBSITE_QUICK_LINKS = "website-quick-links",


  // Error pages
  FORBIDDEN = "403",
  NOT_FOUND = "404",
  HOME = "HOME",
};

export type RouteName = (typeof RouteNames)[keyof typeof RouteNames];