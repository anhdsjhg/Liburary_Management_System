export type StatExportRequest = {
  date_from?: string
  date_to?: string
  group_by?: 'day' | 'month' | 'year'
  format?: 'xlsx' | 'pdf'
}

export type StatExportResponse = {
  url: string
  filename: string
}
