export type MostReadBooksExportRequest = {
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type MostReadBooksExportResponse = {
  url: string
  filename: string
}
