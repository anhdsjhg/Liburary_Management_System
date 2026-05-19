export type DynamicReportCategory = {
  category_id: number;
  category_title: string;
  category_description: string | null;
};

export type DynamicReportCategoriesResponse = {
  res: DynamicReportCategory[];
};