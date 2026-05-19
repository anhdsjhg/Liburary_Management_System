/**
 * application/types/table.ts
 *
 * Table + pagination types used across application/components.
 * Placed inside application/ to avoid @/shared alias dependency.
 */

import type { Component } from 'vue'

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
export interface PaginationMeta {
  total: number
  from: number | null
  to: number | null
  current_page: number
  last_page: number
  per_page: number
}

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------
export interface TableColumnDef<TRow = Record<string, unknown>> {
  name: string
  link: keyof TRow & string
  is_date?: boolean
  display_func?: (row: TRow) => string
  slot?: string
  custom_func?: (row: TRow) => void
  class_func?: (row: TRow) => Record<string, boolean>
  invisible?: boolean
  colspan?: number
  rowspan?: number
  reverse?: boolean
}

// ---------------------------------------------------------------------------
// Selectable
// ---------------------------------------------------------------------------
export interface SelectableConfig<TRow = Record<string, unknown>> {
  available: boolean
  data?: TRow[]
  selected?: TRow[]
  button_title?: string
  func?: (selected: TRow[]) => void
  copy?: (selected: TRow[]) => void
  showSelected?: (selected: TRow[]) => void
  if?: (row: TRow) => boolean
}

// ---------------------------------------------------------------------------
// Edit / Delete / Actions
// ---------------------------------------------------------------------------
export interface EditConfig<TRow = Record<string, unknown>> {
  available: boolean
  component?: Component
  link?: { path?: string } | string
  lastCreated?: unknown
  reCreate?: boolean
}

export interface DeleteConfig {
  available: boolean
}

export interface CustomAction<TRow = Record<string, unknown>> {
  available: boolean
  title: string
  class?: string | string[]
  func: (row: TRow) => void
}

export interface ServiceConfig<TRow = Record<string, unknown>> {
  available: boolean
  title?: string
  func?: (row: TRow) => void
  showMore?: (row: TRow) => void
}

export interface ShowMoreConfig<TRow = Record<string, unknown>> {
  available: boolean
  title?: string
  func?: (row: TRow) => void
}