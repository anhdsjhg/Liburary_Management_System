export type AuthorityLanguage = {
  language: string;
  full_title: string;
  title: string;
};

export type AuthoritySubjectTerm = {
  id: number;
  [key: string]: unknown;
};

export type AuthorityType = {
  type: string;
  title: string;
};

export type AuthorityAuthor = {
  author: string;
};

export type AuthorityDataResponse = {
  res: {
    languages: AuthorityLanguage[];
    subject_terms: AuthoritySubjectTerm[];
    type: AuthorityType[];
    authors: AuthorityAuthor[];
  };
};