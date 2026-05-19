import type { AnnouncementItem } from "../get/types";

export type AnnouncementCreateRequest = {
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

export type AnnouncementCreateResponse = {
  res: { id: number };
};

export type AnnouncementSearchRequest = {
  add_options?: Array<{
    key: string;
    value: string | Record<string, string>;
  }>;
  order?: {
    key: string;
    mode: "asc" | "desc";
  };
  page?: number;
  per_page?: number;
};

export type AnnouncementSearchResponse = {
  res: {
    data: AnnouncementItem[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};