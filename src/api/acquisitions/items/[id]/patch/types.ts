export type ItemUpdateRequest = {
  inv_id: number | string;
  j_issue_id: number | string | null;
  batch_id: number;
  cost: number;
  currency: string;
  prog_code: string[];
  location: string;
  pps: string;
  status: number;
  count: number;
  author: string;
  act_type?: string;
  act_no?: string;
  issue_name: string;
  issue_num: string;
  issue_date: string;
};

export type ItemUpdateResponse = {
  res: {
    message: string;
    result: boolean;
  };
};
