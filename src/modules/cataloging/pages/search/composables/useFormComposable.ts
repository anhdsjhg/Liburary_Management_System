import { reactive } from "vue";
import type { CatalogingSearchAddOption } from "@/api/cataloging/search/get/types";

export interface CatalogingFilterForm {
  query: string;
  type: string;
  state: string;
  inv_id: string;
  batch_id: string;
  genres: string;
}

export function useCatalogingFilterForm() {
  const form = reactive<CatalogingFilterForm>({
    query: "",
    type: "",
    state: "",
    inv_id: "",
    batch_id: "",
    genres: "",
  });

  function buildAddOptions(): CatalogingSearchAddOption[] {
    const options: CatalogingSearchAddOption[] = [];

    if (form.query.trim()) {
      options.push({ key: "query", value: form.query.trim() });
    }
    if (form.type) {
      options.push({ key: "type", value: form.type });
    }
    if (form.state) {
      options.push({ key: "state", value: form.state });
    }
    if (form.inv_id.trim()) {
      options.push({ key: "inv_id", value: form.inv_id.trim() });
    }
    if (form.batch_id.trim()) {
      options.push({ key: "batch_id", value: form.batch_id.trim() });
    }
    if (form.genres.trim()) {
      options.push({ key: "genres", value: form.genres.trim() });
    }

    return options;
  }

  function reset() {
    Object.assign(form, {
      query: "",
      type: "",
      state: "",
      inv_id: "",
      batch_id: "",
      genres: "",
    });
  }

  return { form, buildAddOptions, reset };
}