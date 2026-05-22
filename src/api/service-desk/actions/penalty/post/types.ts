export type SetPenaltyRequest = {
  penalty_id: number;
  user_cid: string;
};

export type CancelPenaltyRequest = {
  penalty_id: number;
  user_cid: string;
};

export type PenaltyResponse = {
  message: string;
};