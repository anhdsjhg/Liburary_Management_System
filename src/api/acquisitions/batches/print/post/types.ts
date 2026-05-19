export type BatchPrintRequest = {
  ids?: number[]
  filters?: Record<string, unknown>
}

export type BatchPrintResponse = {
  url: string
  filename: string
}
