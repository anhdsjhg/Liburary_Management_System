export type ItemCreateRequest = {
  title: string;
  author: string;
  isbn: string;
  issn?: string;
  volume?: string;
  item_type: string;
  batch_id: number;
  publisher_id: number;
  count: number;
  cost: number;
  currency: string;
  location: string;
  pub_year: number;
  pub_city: string;
  pps: string;
  prog_code: string[];
  status: number;
  act_type?: string;
  act_no?: string;
  issue_name?: string;
  issue_num?: string;
  issue_date?: string;
  custom_inv_id?: string;
};

export type ItemCreateResponse = {
  res: {
    message: string;
    result: boolean;
  };
};
