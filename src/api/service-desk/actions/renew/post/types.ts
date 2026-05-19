export type RenewMaterialRequest = {
  loan_id: number;
  duration: number;
};

export type RenewMaterialResponse = {
  res: boolean;
};