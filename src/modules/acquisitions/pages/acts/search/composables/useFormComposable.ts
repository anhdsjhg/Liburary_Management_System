import { reactive } from "vue";

export interface ActSearchForm {
  query: string;
  status: string;
}

export function useActSearchForm() {
  const form = reactive<ActSearchForm>({
    query: "",
    status: "",
  });

  function reset() {
    form.query = "";
    form.status = "";
  }

  function buildAddOptions() {
    const options: Array<{ key: string; value: string }> = [];
    if (form.query.trim()) {
      options.push({ key: "all", value: form.query.trim() });
    }
    if (form.status) {
      options.push({ key: "status", value: form.status });
    }
    return options;
  }

  return { form, reset, buildAddOptions };
}