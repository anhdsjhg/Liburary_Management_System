export type PeriodicalsExportRequest = {
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type PeriodicalsExportResponse = {
  url: string
  filename: string
}
