export type DynamicReportCategory = {
  category_id: string;
  parent_id: string | null;
  title_en: string | null;
  title_ru: string | null;
  title_kz: string | null;
};

export type DynamicReportCategoriesResponse = {
  res: DynamicReportCategory[];
};
