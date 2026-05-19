export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthLoginUser = {
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

export type AuthLoginResponse = {
  res: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: AuthLoginUser;
  };
};