export type ActExportRequest = {
  ids?: number[]
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type ActExportResponse = {
  url: string
  filename: string
}
