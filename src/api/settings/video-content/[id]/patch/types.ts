export type VideoContentUpdateRequest = {
  video_id: number | string;
  title_en: string;
  title_ru: string;
  title_kz: string;
  link: string;
  embed_link: string;
};

export type VideoContentUpdateResponse = {
  res: unknown;
};