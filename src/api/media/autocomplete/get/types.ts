export type MediaAutocompleteRequest = {
  value: string;
  key: "all" | "title" | "author" | "isbn" | "publisher";
  max?: number;
};

export type MediaAutocompleteItem = {
  id: number;
  result: string;
  title?: string;
  year?: number;
};

export type MediaAutocompleteResponse = {
  res: MediaAutocompleteItem[];
};