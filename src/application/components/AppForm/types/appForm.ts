import type { Component } from 'vue'
import type { ZodTypeAny } from 'zod'

export type FieldType =
  | 'text' | 'number' | 'email' | 'password'
  | 'textarea' | 'select' | 'multiselect'
  | 'checkbox' | 'toggle' | 'phone' | 'editor' | 'date' | 'custom'

export interface SelectOption {
  label: string
  value: string | number | boolean
}

export interface FormFieldDef<TModel = Record<string, unknown>> {
  label: string
  key: keyof TModel & string
  type: FieldType
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: SelectOption[] | (() => SelectOption[])
  slot?: string
  component?: Component
  cols?: number
  schema?: ZodTypeAny
}

export interface AppFormConfig<TModel = Record<string, unknown>> {
  fields: FormFieldDef<TModel>[]
  schema?: ZodTypeAny
  submitLabel?: string
  cancelLabel?: string
  gridCols?: number
}