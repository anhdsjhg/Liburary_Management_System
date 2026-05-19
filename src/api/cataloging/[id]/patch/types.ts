export type CatalogingUpdateRequest = {
  type: string;
  id: number | string;
  data: Array<{
    id: string;
    pid: string | null;
    field_code: string | null;
    ind1: string | null;
    ind2: string | null;
    title: string | null;
    data: string | null;
    repeatable: number;
  }>;
};

export type CatalogingUpdateResponse = {
  res: {
    message: string;
    result: boolean;
  };
};