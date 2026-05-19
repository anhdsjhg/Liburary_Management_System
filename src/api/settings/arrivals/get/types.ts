export type ArrivalItem = {
  id: number;
  inv_id: string | null;
  title: string;
  author: string | null;
  isbn: string | null;
  year: number | null;
  language: string | null;
  page_num: number | null;
  image: string | null;
  type_key: string;
  arrival_update_date: string;
};

export type ArrivalsGetResponse = {
  res: ArrivalItem[];
};