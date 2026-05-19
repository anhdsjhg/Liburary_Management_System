export type BarcodeReports = {
  total: number;
  printed: number;
  not_printed: number;
  initialized: number;
  not_initialized: number;
  printed_and_initialized: number;
  meta: number;
  not_printed_and_not_initialized: number;
};

export type BarcodeReportsResponse = {
  res: BarcodeReports;
};