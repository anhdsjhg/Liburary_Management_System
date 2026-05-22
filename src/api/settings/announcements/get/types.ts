export type AnnouncementItem = {
  id: number | string;

  title_en: string | null;
  title_ru: string | null;
  title_kz: string | null;

  place_en: string | null;
  place_ru: string | null;
  place_kz: string | null;

  description_en: string | null;
  description_ru: string | null;
  description_kz: string | null;

  image: string | null;

  start_date: string;
  start_time: string | null;

  end_date: string | null;
  end_time: string | null;

  type: "announcement" | "event";

  link: string | null;

  create_date?: string | null;
  edit_date?: string | null;

  created_by?: string | null;
  edited_by?: string | null;
};

export type AnnouncementsGetResponse = {
  res: {
    data: AnnouncementItem[];

    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};