import { reactive } from "vue";

export interface SupplierSearchForm {
  query: string;
}

export function useSupplierSearchForm() {
  const form = reactive<SupplierSearchForm>({ query: "" });

  function reset() {
    form.query = "";
  }

  function buildAddOptions() {
    return form.query.trim()
      ? [{ key: "all", value: form.query.trim() }]
      : [];
  }

  return { form, reset, buildAddOptions };
}