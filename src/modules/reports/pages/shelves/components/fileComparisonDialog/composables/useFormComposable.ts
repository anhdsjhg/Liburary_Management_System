import { ref } from "vue";

export function useFileComparisonForm() {
  const originalFile = ref<File | null>(null);
  const deviceFile = ref<File | null>(null);

  function reset() {
    originalFile.value = null;
    deviceFile.value = null;
  }

  function toFormData(): FormData {
    const fd = new FormData();
    if (originalFile.value) fd.append("originalFile", originalFile.value);
    if (deviceFile.value) fd.append("deviceFile", deviceFile.value);
    return fd;
  }

  return { originalFile, deviceFile, reset, toFormData };
}