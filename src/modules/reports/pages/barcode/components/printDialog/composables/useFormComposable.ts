import { reactive } from "vue";

export interface BarcodePrintForm {
  locale: string;
}

export function useBarcodePrintForm() {
  const form = reactive<BarcodePrintForm>({
    locale: "en",
  });

  return { form };
}