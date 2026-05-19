import { reactive } from "vue";
import type { VideoContentCreateRequest } from "@/api/settings/video-content/post/types";

export function useVideoForm(initial?: Partial<VideoContentCreateRequest>) {
  const form = reactive<VideoContentCreateRequest>({
    title_en: "",
    title_ru: "",
    title_kz: "",
    link: "",
    embed_link: "",
    ...initial,
  });

  function fill(data: Partial<VideoContentCreateRequest>) {
    Object.assign(form, data);
  }

  return { form, fill };
}