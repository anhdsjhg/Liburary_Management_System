import { reactive } from "vue";

export interface ItemSearchForm {
  query: string;
  batch_id: string;
  act_no: string;
}

export function useItemSearchForm() {
  const form = reactive<ItemSearchForm>({
    query: "",
    batch_id: "",
    act_no: "",
  });

  function reset() {
    form.query = "";
    form.batch_id = "";
    form.act_no = "";
  }

  function buildAddOptions() {
    const options: Array<{ key: string; value: string }> = [];
    if (form.query.trim()) {
      options.push({ key: "all", value: form.query.trim() });
    }
    if (form.batch_id) {
      options.push({ key: "batch_id", value: form.batch_id });
    }
    if (form.act_no) {
      options.push({ key: "act_no", value: form.act_no });
    }
    return options;
  }

  return { form, reset, buildAddOptions };
}