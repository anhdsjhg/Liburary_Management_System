export type InventoryBooksExportRequest = {
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type InventoryBooksExportResponse = {
  url: string
  filename: string
}
