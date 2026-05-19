export type KsuForm2Request = {
  from?: string;
  to?: string;
  specialities?: string[];
  supply_type?: string;
  pps?: boolean;
};

export type KsuForm2Row = {
  prog_code: string | null;
  prog_code_title: string | null;
  title: string | null;
  main_author: string | null;
  other_authors: string | null;
  pub_city: string | null;
  pub_name: string | null;
  pub_year: number | null;
  page_num: number | null;
  genre: string | null;
  inv_count: number;
  stud_count: number;
};

export type KsuForm2Response = {
  res: KsuForm2Row[];
};