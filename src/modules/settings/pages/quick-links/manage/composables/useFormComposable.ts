import { reactive } from "vue";

export interface QuickLinkForm {
  title_en: string;
  title_ru: string;
  title_kz: string;
  description_en: string;
  description_ru: string;
  description_kz: string;
  link: string;
}

export function useQuickLinkForm(initial?: Partial<QuickLinkForm>) {
  const form = reactive<QuickLinkForm>({
    title_en: "",
    title_ru: "",
    title_kz: "",
    description_en: "",
    description_ru: "",
    description_kz: "",
    link: "",
    ...initial,
  });

  function fill(data: Partial<QuickLinkForm>) {
    Object.assign(form, data);
  }

  function reset() {
    Object.assign(form, {
      title_en: "", title_ru: "", title_kz: "",
      description_en: "", description_ru: "", description_kz: "",
      link: "",
    });
  }

  return { form, fill, reset };
}