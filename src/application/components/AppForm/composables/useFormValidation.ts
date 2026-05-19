import { ref, reactive } from 'vue'
import type { ZodTypeAny, ZodError } from 'zod'

export interface ValidationErrors { [field: string]: string | undefined }

export function useFormValidation(schema?: ZodTypeAny) {
  const errors = reactive<ValidationErrors>({})
  const touched = reactive<Record<string, boolean>>({})
  const isValid = ref(true)

  function touch(field: string) { touched[field] = true }

  async function validate(model: unknown): Promise<boolean> {
    clearErrors()
    if (!schema) { isValid.value = true; return true }
    const result = await schema.safeParseAsync(model)
    if (result.success) { isValid.value = true; return true }
    applyZodErrors(result.error)
    isValid.value = false
    return false
  }

  function applyZodErrors(error: ZodError<any>) {
    error.issues.forEach(e => {
      errors[e.path.join('.')] = e.message
    })
  }

  function clearErrors() {
    Object.keys(errors).forEach(k => delete errors[k])
    isValid.value = true
  }

  function reset() {
    clearErrors()
    Object.keys(touched).forEach(k => delete touched[k])
  }

  return { errors, touched, isValid, validate, touch, reset }
}