import { reactive } from "vue";

export interface ArrivalForm {
  inv_id: string;
  image_url: string;
}

export function useArrivalForm() {
  const form = reactive<ArrivalForm>({
    inv_id: "",
    image_url: "",
  });

  function reset() {
    form.inv_id = "";
    form.image_url = "";
  }

  return { form, reset };
}