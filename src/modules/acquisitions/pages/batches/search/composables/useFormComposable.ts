import { reactive, ref } from "vue";

export interface BatchSearchForm {
  query: string;
  status: string;
  sup_type: string;
}

export function useBatchSearchForm() {
  const form = reactive<BatchSearchForm>({
    query: "",
    status: "",
    sup_type: "",
  });

  function reset() {
    form.query = "";
    form.status = "";
    form.sup_type = "";
  }

  function buildAddOptions() {
    const options: Array<{ key: string; value: string }> = [];
    if (form.query.trim()) {
      options.push({ key: "all", value: form.query.trim() });
    }
    if (form.status) {
      options.push({ key: "status", value: form.status });
    }
    if (form.sup_type) {
      options.push({ key: "sup_type", value: form.sup_type });
    }
    return options;
  }

  return { form, reset, buildAddOptions };
}