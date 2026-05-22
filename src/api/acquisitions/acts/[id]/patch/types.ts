export type ActUpdateRequest = {
  act_id: number | string;
  act_date: string;
  protocol_id: string;
  protocol_date: string;
  notes: string;
};

export type ActUpdateResponse = {
  res: { id: number };
};
