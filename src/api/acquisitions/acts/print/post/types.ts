export type ActPrintRequest = {
  ids?: number[]
  filters?: Record<string, unknown>
}

export type ActPrintResponse = {
  url: string
  filename: string
}
