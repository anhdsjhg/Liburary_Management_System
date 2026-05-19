import type { ComputedRef, Ref } from "vue";

export type ApiResponse<T = unknown> = {
  res: T;
  message?: string;
};

/**
 * Laravel API error shape.
 * Normalized by errorService.normalizeError().
 */
export type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

// ============================================================================
// Pagination
// Matches Laravel paginator + legacy getResults/getAllData request shape
// ============================================================================

/**
 * Laravel paginated response envelope.
 * response.data.res when the endpoint returns a paginator.
 *
 * @example
 * const data: PaginatedResponse<Batch> = await apiService.post('/batch/search', body)
 * const { data: rows, current_page, last_page } = data
 */
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  from: number | null;
  to: number | null;
  current_page: number;
  last_page: number;
  per_page: number;
};

/**
 * Request body for paginated + sortable endpoints.
 * Matches legacy getResults / getAllData request builder.
 */
export type PaginatedRequest = {
  page: number;
  per_page: number;
  order?: {
    key: string;
    mode: "asc" | "desc";
  };
};

/**
 * Search request body — extends PaginatedRequest.
 * Matches legacy getResults() mixin payload.
 */
export type SearchRequest = PaginatedRequest & {
  add_options?: SearchOption[];
  search_options?: SearchOption[];
};

export type SearchOption = {
  key: string;
  value: unknown;
  operator?: "and" | "or" | "not";
};

// ============================================================================
// Nullable helpers
// ============================================================================

/** T | null */
export type Nullable<T> = T | null;

/** All properties of T become T[K] | null */
export type NullableValues<T> = {
  [K in keyof T]: T[K] | null;
};

/** Recursively makes all nested properties nullable */
export type DeepNullable<T> = T extends object
  ? { [K in keyof T]: DeepNullable<T[K]> | null }
  : T | null;

// ============================================================================
// Vue reactive helpers
// ============================================================================

/** Accepts both Ref<T> and ComputedRef<T> — useful in composable args */
export type RefComputed<T> = Ref<T> | ComputedRef<T>;

// ============================================================================
// Common base entity types
// Used across acquisitions, cataloging, settings etc.
// ============================================================================

/**
 * Base fields present on most API entities.
 */
export type BaseEntity = {
  id: number | string;
};

/**
 * Entity with audit timestamps (create/edit).
 * Matches Laravel created_at / updated_at pattern used in legacy components.
 */
export type TimestampedEntity = BaseEntity & {
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  edited_by?: string | null;
};

/**
 * Trilingual title fields.
 * Used across announcements, videos, quick links, lib links.
 *
 * @example
 * type Announcement = TimestampedEntity & LocalizedTitle & { ... }
 */
export type LocalizedTitle = {
  title_en?: string | null;
  title_ru?: string | null;
  title_kz?: string | null;
};

/**
 * Trilingual description fields.
 */
export type LocalizedDescription = {
  description_en?: string | null;
  description_ru?: string | null;
  description_kz?: string | null;
};

/**
 * Trilingual title + description combined.
 */
export type LocalizedContent = LocalizedTitle & LocalizedDescription;

// ============================================================================
// Select / Dropdown option
// Used across AppForm selects and legacy Input.vue selectable prop
// ============================================================================

export type SelectOption<TValue = string | number> = {
  label: string;
  value: TValue;
};

/**
 * Generic key/value option used in legacy Dropdown components.
 */
export type KeyValueOption = {
  key: string;
  name?: string;
  title?: string;
};

// ============================================================================
// Table column definition
// Matches AppDataTable column shape
// ============================================================================

export type TableColumnDef<TRow = Record<string, unknown>> = {
  name: string;
  link: keyof TRow & string;
  is_date?: boolean;
  display_func?: (row: TRow) => string;
  slot?: string;
  custom_func?: (row: TRow) => void;
  class_func?: (row: TRow) => Record<string, boolean>;
  invisible?: boolean;
  colspan?: number;
  rowspan?: number;
};

// ============================================================================
// Sort state
// ============================================================================

export type SortDir = "asc" | "desc";

export type SortState = {
  field: string;
  dir: SortDir;
};

// ============================================================================
// Auth / User
// ============================================================================

export type UserType = "student" | "employee";

export type AuthUser = {
  id: number | string;
  username?: string;
  name?: string;
  user_cid?: string;
  type?: UserType;
  is_admin?: boolean;
  duration?: number;
};

// ============================================================================
// File / Blob
// ============================================================================

export type DownloadExtension = "xlsx" | "pdf" | "xml" | "txt" | "csv";