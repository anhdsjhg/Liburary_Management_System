import { reactive } from "vue";

export interface PublisherSearchForm {
  query: string;
}

export function usePublisherSearchForm() {
  const form = reactive<PublisherSearchForm>({ query: "" });

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