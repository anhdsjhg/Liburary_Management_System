import { ref } from "vue";

export function useBackgroundImageForm() {
  const file = ref<File | null>(null);
  const imageUrl = ref("");

  function reset() {
    file.value = null;
    imageUrl.value = "";
  }

  return { file, imageUrl, reset };
}