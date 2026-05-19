export type AnnouncementShowResponse = {
  res: {
    announcement_id: number;
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
  }[];
};