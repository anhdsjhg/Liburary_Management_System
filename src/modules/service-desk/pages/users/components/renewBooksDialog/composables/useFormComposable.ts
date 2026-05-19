import { reactive } from "vue";
import type { RenewMaterialRequest } from "@/api/service-desk/actions/renew/post/types";

export interface RenewForm {
  loan_id: number | null;
  duration: number;
}

export function useRenewForm(defaultDuration = 21) {
  const form = reactive<RenewForm>({
    loan_id: null,
    duration: defaultDuration,
  });

  function toRequest(): RenewMaterialRequest {
    return {
      loan_id: form.loan_id!,
      duration: form.duration,
    };
  }

  function setLoan(loanId: number, duration: number) {
    form.loan_id = loanId;
    form.duration = duration;
  }

  return { form, toRequest, setLoan };
}