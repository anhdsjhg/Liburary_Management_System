export type GiveMaterialRequest = {
  inv_id: string | number;
  user_cid: string;
  material_id: number | string;
  librarian_user_cid: string;
  loan_id: number;
  duration?: number;
  due_date?: string;
};

export type GiveMaterialResponse = {
  res: {
    message: string;
    result: boolean;
  };
};