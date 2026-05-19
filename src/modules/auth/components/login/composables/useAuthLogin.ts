import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/application/stores/auth.store";
import { useAuthLoginApi } from "@/api/auth/login/post";
import { useAuthLogoutApi } from "@/api/auth/logout/post";
import {
  showSuccessToast,
  showErrorToast,
} from "@/application/services/toastService";
import type { LoginForm } from "./useFormComposable";
import axiosInstance from "@/application/configs/axios";

export function useAuthLogin(onSuccess?: () => void) {
  const { t } = useI18n();
  const authStore = useAuthStore();

  const { mutate, isPending: isSubmitting } = useAuthLoginApi();

  function submitLogin(form: LoginForm): void {
    mutate(
      { username: form.username, password: form.password },
      {
        async onSuccess(data) {
        authStore.setFromLoginResponse(data);

        try {
          const cid = data.res.user.user_cid;
          const result = await axiosInstance.get(`/manage/users/${cid}/visualization`);
          if (result.data?.res) {
            authStore.setModules(result.data.res.map((m: any) => m.route_name));
          }
        } catch {}

        authStore.loginVisible = false;
        showSuccessToast(t("auth.login_success"));
        onSuccess?.();
      },
        onError() {
          showErrorToast(t("auth.login_error"));
        },
      }
    );
  }

  return { isSubmitting, submitLogin };
}

export function useAuthLogout() {
  const { t } = useI18n();
  const authStore = useAuthStore();
  const { mutate: logoutMutate } = useAuthLogoutApi();

  function submitLogout(): void {
    logoutMutate(undefined, {
      onSuccess() {
        authStore.logout();
        showSuccessToast(t("auth.logout_success"));
      },
      onError() {
        authStore.logout();
        showErrorToast(t("auth.logout_error"));
      },
    });
  }

  return { submitLogout };
}