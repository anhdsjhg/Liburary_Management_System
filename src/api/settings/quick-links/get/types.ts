export type QuickLink = {
  id: number;
  title_en: string | null;
  title_ru: string | null;
  title_kz: string | null;
  description_en: string | null;
  description_ru: string | null;
  description_kz: string | null;
  link: string;
};

export type QuickLinksGetResponse = {
  res: QuickLink[];
};