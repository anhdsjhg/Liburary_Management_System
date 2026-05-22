export type BatchPrintRequest = {
  id: number | string;
  location?: string;
  locale?: string;
};

export type BatchPrintResponse = Blob;
