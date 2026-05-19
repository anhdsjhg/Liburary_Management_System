export type ShelvesFileComparisonResponse = {
  success: boolean;
  files: {
    matched: string;
    missing: string;
    extra: string;
    invalid: string;
  };
};