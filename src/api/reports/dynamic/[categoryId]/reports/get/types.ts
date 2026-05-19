export type DynamicReportListItem = {
  query_id: number;
  query_title: string;
  query_description: string | null;
};

export type DynamicReportsResponse = {
  res: DynamicReportListItem[];
};