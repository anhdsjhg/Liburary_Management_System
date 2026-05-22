import { ref } from 'vue'
import type { AxiosError } from 'axios'

export function useFormErrors() {
  const serverErrors = ref<Record<string, string>>({})

  function setFromAxiosError(err: unknown) {
    const axiosErr = err as AxiosError<{ errors?: Record<string, string[]> }>
    const errors = axiosErr?.response?.data?.errors
    if (errors) {
      const flat: Record<string, string> = {}
      for (const [key, messages] of Object.entries(errors)) {
        flat[key] = Array.isArray(messages) ? (messages[0] ?? String(messages)) : String(messages)
      }
      serverErrors.value = flat
    }
  }

  function clearAll() {
    serverErrors.value = {}
  }

  return { serverErrors, setFromAxiosError, clearAll }
}
