export type BatchExportRequest = {
  ids?: number[]
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type BatchExportResponse = {
  url: string
  filename: string
}
