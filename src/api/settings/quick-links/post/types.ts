export type QuickLinkCreateRequest = {
  title_en: string;
  title_ru: string;
  title_kz: string;
  description_en: string;
  description_ru: string;
  description_kz: string;
  link: string;
};

export type QuickLinkCreateResponse = {
  res: unknown;
};