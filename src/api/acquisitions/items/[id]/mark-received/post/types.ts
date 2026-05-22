export type ItemMarkReceivedRequest = {
  j_issue_id: number | string;
};

export type ItemMarkReceivedResponse = {
  res: {
    message: string;
    result: boolean;
  };
};
