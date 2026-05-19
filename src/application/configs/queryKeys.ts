export const queryKeys = {
  acts: {
    all: () => ["acts"] as const,
    search: (filters: unknown) => ["acts", "search", filters] as const,
    detail: (id: string | number) => ["acts", "detail", id] as const,
    items: (id: string | number) => ["acts", "items", id] as const,
    lostIds: () => ["acts", "lost-ids"] as const,
  },

  batches: {
    all: () => ["batches"] as const,
    search: (filters: unknown) => ["batches", "search", filters] as const,
    detail: (id: string | number) => ["batches", "detail", id] as const,
    lostIds: () => ["batches", "lost-ids"] as const,
  },

  items: {
    all: () => ["items"] as const,
    search: (filters: unknown) => ["items", "search", filters] as const,
    detail: (id: string | number) => ["items", "detail", id] as const,
  },

  suppliers: {
    all: () => ["suppliers"] as const,
    names: () => ["suppliers", "names"] as const,
    types: () => ["suppliers", "types"] as const,
    search: (filters: unknown) => ["suppliers", "search", filters] as const,
  },

  publishers: {
    all: () => ["publishers"] as const,
    names: () => ["publishers", "names"] as const,
    search: (filters: unknown) => ["publishers", "search", filters] as const,
  },

  cataloging: {
    all: () => ["cataloging"] as const,
    search: (filters: unknown) => ["cataloging", "search", filters] as const,
    detail: (id: string | number, typeKey: string) =>
      ["cataloging", "detail", id, typeKey] as const,
    authority: () => ["cataloging", "authority"] as const,
    genres: () => ["cataloging", "genres"] as const,
    types: () => ["cataloging", "types"] as const,
    statuses: () => ["cataloging", "statuses"] as const,
    idList: (id: string | number, typeKey: string) =>
      ["cataloging", "id-list", id, typeKey] as const,
    history: (id: string | number, typeKey: string) =>
      ["cataloging", "history", id, typeKey] as const,
    reports: () => ["cataloging", "reports"] as const,
  },

  serviceDesk: {
    users: (filters: unknown) => ["service-desk", "users", filters] as const,
    userDetail: (id: string | number, type: string) =>
      ["service-desk", "user", id, type] as const,
    loans: (userId: string | number) =>
      ["service-desk", "loans", userId] as const,
  },

  reports: {
    attendance: (filters: unknown) =>
      ["reports", "attendance", filters] as const,
    barcode: () => ["reports", "barcode"] as const,
    booksHistory: (filters: unknown) =>
      ["reports", "books-history", filters] as const,
    inventoryBooks: (filters: unknown) =>
      ["reports", "inventory-books", filters] as const,
    mostRead: (filters: unknown) =>
      ["reports", "most-read", filters] as const,
    notFoundBooks: (filters: unknown) =>
      ["reports", "not-found-books", filters] as const,
    ksu: (filters: unknown) => ["reports", "ksu", filters] as const,
    form2: (filters: unknown) => ["reports", "form2", filters] as const,
    periodicals: (filters: unknown) =>
      ["reports", "periodicals", filters] as const,
    dynamic: {
      categories: () => ["reports", "dynamic", "categories"] as const,
      list: (categoryId: string | number) =>
        ["reports", "dynamic", "list", categoryId] as const,
      detail: (reportId: string | number) =>
        ["reports", "dynamic", "detail", reportId] as const,
    },
  },

  settings: {
    announcements: {
      all: () => ["settings", "announcements"] as const,
      detail: (id: string | number) =>
        ["settings", "announcements", "detail", id] as const,
    },
    videos: () => ["settings", "videos"] as const,
    arrivals: () => ["settings", "arrivals"] as const,
    quickLinks: () => ["settings", "quick-links"] as const,
    backgroundImages: () => ["settings", "background-images"] as const,
  },

  website: {
    announcements: (filters: unknown) =>
      ["website", "announcements", filters] as const,
    events: (filters: unknown) => ["website", "events", filters] as const,
    arrivals: () => ["website", "arrivals"] as const,
  },

  specialities: {
    all: () => ["specialities"] as const,
  },

  admin: {
    modules: () => ["admin", "modules"] as const,
    permissions: (userId: string | number) =>
      ["admin", "permissions", userId] as const,
  },

  auth: {
    me: () => ["auth", "me"] as const,
  },

  media: {
    search: (filters: unknown) => ["media", "search", filters] as const,
    detail: (id: string | number) => ["media", "detail", id] as const,
    autocomplete: (query: string, key: string) =>
      ["media", "autocomplete", query, key] as const,
  },
} as const;