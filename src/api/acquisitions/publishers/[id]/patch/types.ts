export type PublisherUpdateRequest = {
  pub_id: number | string;
  pub_name?: string;
  com_name?: string;
  address?: string;
  email?: string;
  fax?: string;
  phone?: string;
};

export type PublisherUpdateResponse = {
  res: { id: number };
};