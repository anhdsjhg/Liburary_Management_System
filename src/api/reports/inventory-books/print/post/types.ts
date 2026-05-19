export type InventoryBooksPrintRequest = {
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type InventoryBooksPrintResponse = {
  url: string
  filename: string
}
