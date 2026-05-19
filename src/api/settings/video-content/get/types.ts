export type VideoContentItem = {
  video_id: number;
  title_en: string | null;
  title_ru: string | null;
  title_kz: string | null;
  link: string;
  embed_link: string;
  create_date: string | null;
};

export type VideoContentGetResponse = {
  res: VideoContentItem[];
};