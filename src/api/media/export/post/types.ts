export type MediaExportRequest = {
  filters?: Record<string, unknown>
  fields?: string[]
  format?: 'xlsx' | 'csv'
}

export type MediaExportResponse = {
  url: string
  filename: string
}
