export type DynamicReportExecuteRequest = {
  query_id: number | string;
  fields: Array<{ key: string; title: string }>;
  parameters: Array<{
    parameter: string;
    value: string | string[] | null;
    v_component: string;
  }>;
};

export type DynamicReportExecuteResponse = {
  res: Record<string, unknown>[];
};