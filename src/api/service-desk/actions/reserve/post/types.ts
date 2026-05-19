export type SetActivityRequest = {
  user_cid: string;
  inactive: 0 | 1;
};

export type SetActivityResponse = {
  message: string;
};