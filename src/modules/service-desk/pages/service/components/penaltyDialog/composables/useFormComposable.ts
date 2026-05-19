import { reactive } from "vue";

export interface PenaltyForm {
  penalty_id: number | null;
}

export function usePenaltyForm() {
  const form = reactive<PenaltyForm>({ penalty_id: null });

  function setPenaltyId(id: number) {
    form.penalty_id = id;
  }

  return { form, setPenaltyId };
}