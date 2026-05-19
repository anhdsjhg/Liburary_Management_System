import type { TableColumnDef } from "@/application/types/table";

export type SortDir = "asc" | "desc";

export interface SortState {
  field: string;
  dir: SortDir;
}

export function sortRows<T extends object>(rows: T[], state: SortState): T[] {
  return [...rows].sort((a, b) => {
    const va = normalize((a as Record<string, unknown>)[state.field]);
    const vb = normalize((b as Record<string, unknown>)[state.field]);
    if (va < vb) return state.dir === "asc" ? -1 : 1;
    if (va > vb) return state.dir === "asc" ? 1 : -1;
    return 0;
  });
}

function normalize(v: unknown): string | number {
  if (v == null) return "";
  const n = Number(v);
  if (!isNaN(n)) return n;
  return String(v).toUpperCase();
}

export function nextSortDir(
  current: SortState | null,
  field: string
): SortDir {
  if (!current || current.field !== field) return "asc";
  return current.dir === "asc" ? "desc" : "asc";
}

export function formatCellDate(value: unknown): string {
  if (!value) return "—";
  try {
    return new Date(String(value)).toLocaleDateString();
  } catch {
    return String(value);
  }
}

export function isColumnSortable<T>(col: TableColumnDef<T>): boolean {
  return !!col.link && !col.invisible;
}