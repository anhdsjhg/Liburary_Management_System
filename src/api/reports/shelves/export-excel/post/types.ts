export type ShelvesExportExcelRequest = {
  filters?: Record<string, unknown>
  format?: 'xlsx' | 'pdf'
}

export type ShelvesExportExcelResponse = {
  url: string
  filename: string
}
