export type BatchExportRequest = {
  id: number | string;
  locale?: string;
};

export type BatchExportResponse = Blob;
