export type GiveMaterialRequest = {
  inv_id: string | number;
  user_cid: string;
  material_id: number | string;
  duration: number;
  loan_id?: number;
};

export type GiveMaterialResponse = {
  res: {
    message: string;
    result: boolean;
  };
};