export type KsuExportRequest = {
  date_from?: string
  date_to?: string
  fund?: string
  format?: 'xlsx' | 'pdf'
}

export type KsuExportResponse = {
  url: string
  filename: string
}
