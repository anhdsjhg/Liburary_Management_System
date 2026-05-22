export type ReturnMaterialRequest = {
  inv_id: string | number;
  user_cid: string;
  loan_id: number;
  librarian_user_cid: string;
  material_id?: number | string;
};

export type ReturnMaterialResponse = {
  res: {
    message: string;
    result: boolean;
  };
};