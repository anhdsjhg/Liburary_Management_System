export type ActCreateRequest = {
  act_date: string;
  protocol_id?: string;
  protocol_date?: string;
  notes?: string;
  custom_id?: number;
};

export type ActCreateResponse = {
  res: { id: number };
};