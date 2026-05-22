export type RenewMaterialRequest = {
  loan_id: number;
  inv_id: string;
  user_cid: string;
  librarian_user_cid: string;
  duration: number;
};

export type RenewMaterialResponse = {
  res: boolean;
};