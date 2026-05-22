import { reactive } from "vue";
import type { AnnouncementCreateRequest } from "@/api/settings/announcements/post/types";

export type AnnouncementForm = Omit<AnnouncementCreateRequest, never>;

export function useAnnouncementForm(initial?: Partial<AnnouncementForm>) {
  const form = reactive<AnnouncementForm>({
    title_en: "",
    title_ru: "",
    title_kz: "",
    place_en: "",
    place_ru: "",
    place_kz: "",
    start_date: "",
    end_date: null,
    description_en: "",
    description_ru: "",
    description_kz: "",
    link: "",
    start_time: "",
    end_time: null,
    image: "",
    type: "announcement",
    ...initial,
  });

  function fill(data: Partial<AnnouncementForm>) {
    Object.assign(form, data);
  }

  return { form, fill };
}