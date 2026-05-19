import { reactive } from "vue";

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginFormErrors {
  username: string;
  password: string;
}

export function useLoginForm() {
  const form = reactive<LoginForm>({
    username: "",
    password: "",
  });

  const errors = reactive<LoginFormErrors>({
    username: "",
    password: "",
  });

  function validate(): boolean {
    let valid = true;

    errors.username = "";
    errors.password = "";

    if (!form.username.trim()) {
      errors.username = "Required";
      valid = false;
    }

    if (!form.password.trim()) {
      errors.password = "Required";
      valid = false;
    }

    return valid;
  }

  function reset() {
    form.username = "";
    form.password = "";
    errors.username = "";
    errors.password = "";
  }

  return { form, errors, validate, reset };
}