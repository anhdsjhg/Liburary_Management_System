import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { RouteNames } from "@/application/router/routeNames";
import type { MediaSearchOption } from "@/api/media/search/get/types";

export interface SearchInput {
  key: MediaSearchOption["key"];
  value: string;
  operator: "and" | "or" | "not";
}

export interface SearchFormState {
  inputs: SearchInput[];
}

export function useSearchForm() {
  const router = useRouter();
  const route = useRoute();

  const form = reactive<SearchFormState>({
    inputs: [
      {
        key: (route.query.key as MediaSearchOption["key"]) ?? "all",
        value: (route.query.q as string) ?? "",
        operator: "and",
      },
    ],
  });

  const searchTypes: Array<{ label: string; value: MediaSearchOption["key"] }> = [
    { label: "All", value: "all" },
    { label: "Title", value: "title" },
    { label: "Author", value: "author" },
    { label: "ISBN", value: "isbn" },
    { label: "Publisher", value: "publisher" },
    { label: "Call Number", value: "call_number" },
  ];

  function addInput() {
    if (form.inputs.length < 5) {
      form.inputs.push({ key: "all", value: "", operator: "and" });
    }
  }

  function removeInput(index: number) {
    form.inputs.splice(index, 1);
  }

  function buildSearchOptions(): MediaSearchOption[] {
    return form.inputs
      .filter((i) => i.value.trim().length > 0)
      .map((i, idx) => ({
        key: i.key,
        value: i.value,
        ...(idx > 0 ? { operator: i.operator } : {}),
      }));
  }

  function buildQuery(): string {
    return form.inputs
      .filter((i) => i.value.trim())
      .map((i, idx) => {
        const prefix = idx === 0 ? "" : `${i.operator} `;
        return `${prefix}${i.key}: ${i.value}`;
      })
      .join(" ");
  }

  function submit() {
    const firstInput = form.inputs[0];
    if (!firstInput?.value.trim()) return;

    router.push({
      name: RouteNames.WEBSITE_SEARCH,
      query: {
        q: firstInput.value,
        key: firstInput.key,
        _t: Date.now(),
      },
    });
  }

  function reset() {
    form.inputs = [{ key: "all", value: "", operator: "and" }];
  }

  return {
    form,
    searchTypes,
    addInput,
    removeInput,
    buildSearchOptions,
    buildQuery,
    submit,
    reset,
  };
}