export type ShelvesExportRequest = {
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type ShelvesExportResponse = {
  url: string
  filename: string
}
