export type VideoContentCreateRequest = {
  title_en: string;
  title_ru: string;
  title_kz: string;
  link: string;
  embed_link: string;
};

export type VideoContentCreateResponse = {
  res: unknown;
};