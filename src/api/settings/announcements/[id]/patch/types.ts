export type AnnouncementUpdateRequest = {
  announcement_id: number | string;
  title_en: string;
  title_ru: string;
  title_kz: string;
  place_en: string;
  place_ru: string;
  place_kz: string;
  start_date: string;
  end_date?: string | null;
  description_en: string;
  description_ru: string;
  description_kz: string;
  link: string;
  start_time: string;
  end_time?: string | null;
  image: string;
};

export type AnnouncementUpdateResponse = {
  res: unknown;
};