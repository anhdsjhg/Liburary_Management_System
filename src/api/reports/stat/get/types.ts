export type StatReportRequest = {
  year?: string;
};

export type StatReportEntry = {
  year: string;
  month: string;
  total_borrow: number;
  on_hands: number;
};

export type StatReportResponse = {
  res: StatReportEntry[];
};