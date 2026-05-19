export const apiTimeouts = {
  DEFAULT: 20_000,
  BLOB: 120_000,
} as const;

export const toastSuccessLifeTime = 1_700;
export const toastErrorLifeTime = 4_000;

export const StorageKeys = {
  TOKEN: "auth-token",
  USER: "user",
  LANG: "lang",
  THEME: "theme",
  MODULES: "user-modules",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export const LOCALES = ["en", "ru", "kz"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const PAGINATION = {
  DEFAULT_PER_PAGE: 25,
  PER_PAGE_OPTIONS: [10, 25, 50, 100, 500] as const,
} as const;

export type PerPageOption = (typeof PAGINATION.PER_PAGE_OPTIONS)[number];

export const UserType = {
  STUDENT: "student",
  EMPLOYEE: "employee",
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

export const ItemTypeKey = {
  BOOK: "BK",
  VISUAL_MATERIAL: "VM",
  MIXED_MEDIA: "MX",
  CONTINUING_RESOURCES: "CR",
  CONFERENCE_FILES: "CF",
  MAPS: "MP",
  MUSIC: "MU",
} as const;

export type ItemTypeKey = (typeof ItemTypeKey)[keyof typeof ItemTypeKey];

export const ITEM_TYPE_LABELS: Record<ItemTypeKey, string> = {
  BK: "Book",
  VM: "Visual Material",
  MX: "Mixed Media",
  CR: "Continuing Resources",
  CF: "Conference Files",
  MP: "Maps",
  MU: "Music",
};

export const SupplyType = {
  DONATED: "D",
  BOUGHT: "B",
  REPLACEMENT: "R",
} as const;

export type SupplyType = (typeof SupplyType)[keyof typeof SupplyType];

export const SUPPLY_TYPE_LABELS: Record<SupplyType, string> = {
  D: "Donated",
  B: "Bought",
  R: "Replacement",
};

export const CatalogingState = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type CatalogingState =
  (typeof CatalogingState)[keyof typeof CatalogingState];

export const LoanStatus = {
  ISSUED: "issued",
  RETURNED: "returned",
  OVERDUE: "overdue",
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];

export const LOAN_DEFAULTS = {
  MAX_BOOKS: 5,
  BORROW_DAYS: 21,
  RENEW_DAYS: 21,
} as const;

export const AUTOCOMPLETE = {
  DEBOUNCE_MS: 500,
  MIN_CHARS: 2,
  MAX_RESULTS: 10,
} as const;

export const IMAGE_COMPRESSION = {
  MAX_WIDTH: 450,
  MAX_HEIGHT: 450,
} as const;

export const ASSETS = {
  NO_COVER: "/images/arrivalsImage/noCover.png",
  LOGO_HORIZONTAL: "/images/logo_horizontal.png",
  LOGO_VERTICAL: "/images/logo_vertical.png",
} as const;

export const EXTERNAL_API = {
  GOOGLE_BOOKS: "https://www.googleapis.com/books/v1/volumes",
} as const;

export const RFID = {
  BASE_URL: "http://localhost/LibraryWebService/LibraryWebService.asmx/",
  GET_ITEM_IDS: "getItemIDS",
  SET_CHECK_IN_OUT: "SetItemsCheckInOut",
} as const;