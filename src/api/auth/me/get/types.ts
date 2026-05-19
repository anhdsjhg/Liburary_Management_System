export type AuthMeUser = {
  id: number | string;
  name: string;
  surname: string;
  username: string;
  email: string;
  type: "employee" | "student";
  user_cid: string;
  is_admin: boolean;
  position_type?: string;
  edu_level_type?: string;
};

export type AuthMeResponse = {
  res: {
    user: AuthMeUser;
  };
};