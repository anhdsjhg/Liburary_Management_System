export type MarcField = {
  id: string;
  pid: string | null;
  field_code: string | null;
  ind1: string | null;
  ind2: string | null;
  title: string | null;
  data: string | null;
  repeatable: number;
};

export type CatalogingShowResponse = {
  res: MarcField[];
  image: string | null;
  id: number;
  type: string;
  state: string;
  created_info: {
    created_by: string | null;
    created_at: string | null;
  };
};