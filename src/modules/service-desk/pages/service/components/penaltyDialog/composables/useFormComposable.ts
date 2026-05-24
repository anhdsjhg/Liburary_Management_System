import { reactive } from "vue";

export interface PenaltyForm {
  penalty_id: number | null;
  user_cid: string | null;
}

export function usePenaltyForm() {
  const form = reactive<PenaltyForm>({
    penalty_id: null,
    user_cid: null,
  });

  function setPenaltyId(id: number) {
    form.penalty_id = id;
  }

  function setUserCid(cid: string) {
    form.user_cid = cid;
  }

  function reset() {
    form.penalty_id = null;
    form.user_cid = null;
  }

  return { form, setPenaltyId, setUserCid, reset };
}