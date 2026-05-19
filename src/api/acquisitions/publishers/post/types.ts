export type PublisherCreateRequest = {
  pub_name: string;
  com_name?: string;
  address?: string;
  email?: string;
  fax?: string;
  phone?: string;
};

export type PublisherCreateResponse = {
  res: { id: number };
};