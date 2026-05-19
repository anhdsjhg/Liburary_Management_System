export type ReturnMaterialRequest = {
  inv_id: string | number;
  user_cid: string;
  loan_id: number;
};

export type ReturnMaterialResponse = {
  res: {
    message: string;
    result: boolean;
  };
};