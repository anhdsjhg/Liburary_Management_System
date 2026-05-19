export type ReportField = {
  field: string;
  title: string;
};

export type ReportParameter = {
  parameter: string;
  title: string;
  v_component: "input" | "select" | "checkbox" | "radio" | "date";
  options?: Array<{ label: string; value: string }>;
};

export type ReportInfo = {
  query_id: number;
  query_title: string;
  query_description: string | null;
};

export type DynamicReportShowResponse = {
  res: {
    fields: ReportField[];
    parameters: ReportParameter[];
    info: ReportInfo;
  };
};