import { reactive } from "vue";

export interface ActionForm {
  barcode: string;
  user_cid: string;
  duration: number;
}

export function useActionForm() {
  const form = reactive<ActionForm>({
    barcode: "",
    user_cid: "",
    duration: 21,
  });

  function reset() {
    form.barcode = "";
    form.user_cid = "";
    form.duration = 21;
  }

  return { form, reset };
}