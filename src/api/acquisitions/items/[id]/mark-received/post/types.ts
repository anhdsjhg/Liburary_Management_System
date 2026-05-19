export type ItemMarkReceivedRequest = {
  id: number | string
  received_at?: string
  quantity_received?: number
}

export type ItemMarkReceivedResponse = {
  id: number
  received: boolean
  received_at: string
}
