export type ActPrintRequest = {
  id: number | string;
  type?: string;
  locale?: string;
};

export type ActPrintResponse = Blob;
