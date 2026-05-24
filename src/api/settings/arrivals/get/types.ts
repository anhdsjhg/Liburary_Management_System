export type ArrivalItem = {
  id: string;
  inv_id: string | null;
  title: string;
  author: string | null;
  isbn: string | null;
  year: string | null;
  language: string | null;
  page_num: string | null;
  image: string | null;
  type_key: string;
  arrival_update_date: string;
  title_related_info?: string | null;
};

export type ArrivalsGetResponse = {
  res: ArrivalItem[];
};