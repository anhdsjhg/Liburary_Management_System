import { reactive } from "vue";
import { useAuthStore } from "@/application/stores/auth.store";
import type { RenewMaterialRequest } from "@/api/service-desk/actions/renew/post/types";

export interface RenewForm {
  loan_id: number | null;
  inv_id: string;
  user_cid: string;
  duration: number;
}

export function useRenewForm(defaultDuration = 21) {
  const authStore = useAuthStore();

  const form = reactive<RenewForm>({
    loan_id: null,
    inv_id: "",
    user_cid: "",
    duration: defaultDuration,
  });

  function toRequest(): RenewMaterialRequest {
    return {
      loan_id: form.loan_id!,
      inv_id: form.inv_id,
      user_cid: form.user_cid,
      librarian_user_cid: authStore.user?.user_cid ?? "",
      duration: form.duration,
    };
  }

  function setLoan(loanId: number, invId: string, userCid: string, duration: number) {
    form.loan_id = loanId;
    form.inv_id = invId;
    form.user_cid = userCid;
    form.duration = duration;
  }

  return { form, toRequest, setLoan };
}
