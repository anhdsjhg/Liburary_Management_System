<script setup lang="ts" generic="TModel extends Record<string, unknown>">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import AppFieldLabel from '../AppFieldLabel.vue'
import AppTextArea from '../AppTextArea.vue'
import AppCheckbox from '../AppCheckbox.vue'
import ToggleSwitchField from './components/ToggleSwitchField.vue'
import PhoneInput from './components/PhoneInput.vue'
import EditorComponent from './components/EditorComponent.vue'
import { useFormValidation } from './composables/useFormValidation'
import type { AppFormConfig, FormFieldDef } from './types/appForm'

interface Props {
  config: AppFormConfig<TModel>
  loading?: boolean
  serverErrors?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), { loading: false })
const emit = defineEmits<{ submit: [model: TModel]; cancel: [] }>()

const model = defineModel<TModel>({ required: true })
const { t } = useI18n()
const { errors, validate, touch, reset } = useFormValidation(props.config.schema)

const localModel = reactive({ ...model.value }) as TModel

watch(localModel, val => { model.value = { ...val } })

async function onSubmit() {
  const ok = await validate(localModel)
  if (!ok) return
  emit('submit', { ...localModel })
}

function onCancel() {
  reset()
  emit('cancel')
}

function getOptions(field: FormFieldDef<TModel>) {
  if (!field.options) return []
  return typeof field.options === 'function' ? field.options() : field.options
}
</script>

<template>
  <form class="app-form" novalidate @submit.prevent="onSubmit">
    <div
      class="app-form__grid"
      :style="{ '--grid-cols': config.gridCols ?? 12 }"
    >
      <template v-for="(field, idx) in config.fields" :key="idx">
        <div
          v-if="!field.hide"
          class="app-form__field"
          :style="{ '--col-span': field.cols ?? 12 }"
        >
          <AppFieldLabel
            v-if="!['checkbox', 'toggle'].includes(field.type)"
            :text="t(field.label)"
            :for="`field-${field.key}`"
            :required="field.required"
          />

          <InputText
            v-if="field.type === 'text' || field.type === 'email'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key] as string"
            v-bind="field.nativeProps ?? {}"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :required="field.required"
            :invalid="!!errors[field.key] || !!serverErrors?.[field.key]"
            class="w-full"
            @blur="touch(field.key)"
          />

          <InputNumber
            v-else-if="field.type === 'number'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key] as number"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :invalid="!!errors[field.key] || !!serverErrors?.[field.key]"
            class="w-full"
            @blur="touch(field.key)"
          />

          <Password
            v-else-if="field.type === 'password'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key] as string"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :invalid="!!errors[field.key] || !!serverErrors?.[field.key]"
            :feedback="false"
            toggle-mask
            class="w-full"
            @blur="touch(field.key)"
          />

          <AppTextArea
            v-else-if="field.type === 'textarea'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key] as string"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :required="field.required"
            @blur="touch(field.key)"
          />

          <Select
            v-else-if="field.type === 'select'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key]"
            :options="getOptions(field)"
            option-label="label"
            option-value="value"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :invalid="!!errors[field.key] || !!serverErrors?.[field.key]"
            class="w-full"
            @blur="touch(field.key)"
          />

          <MultiSelect
            v-else-if="field.type === 'multiselect'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key]"
            :options="getOptions(field)"
            option-label="label"
            option-value="value"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :invalid="!!errors[field.key] || !!serverErrors?.[field.key]"
            class="w-full"
            @blur="touch(field.key)"
          />

          <DatePicker
            v-else-if="field.type === 'date'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key] as Date"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :invalid="!!errors[field.key] || !!serverErrors?.[field.key]"
            date-format="yy-mm-dd"
            show-icon
            class="w-full"
            @blur="touch(field.key)"
          />

          <label
            v-else-if="field.type === 'checkbox'"
            :for="`field-${field.key}`"
            class="app-form__checkbox-label"
          >
            <AppCheckbox
              :id="`field-${field.key}`"
              v-model="(localModel as Record<string, unknown>)[field.key] as boolean"
              :disabled="field.disabled"
              :aria-label="t(field.label)"
            />
            <span>{{ t(field.label) }}</span>
          </label>

          <ToggleSwitchField
            v-else-if="field.type === 'toggle'"
            v-model="(localModel as Record<string, unknown>)[field.key] as boolean"
            :label="t(field.label)"
            :disabled="field.disabled"
          />

          <PhoneInput
            v-else-if="field.type === 'phone'"
            :id="`field-${field.key}`"
            v-model="(localModel as Record<string, unknown>)[field.key] as string"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :required="field.required"
            @blur="touch(field.key)"
          />

          <EditorComponent
            v-else-if="field.type === 'editor'"
            v-model="(localModel as Record<string, unknown>)[field.key] as string"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
          />

          <slot
            v-else-if="field.type === 'custom' && field.slot"
            :name="field.slot"
            :field="field"
            :model="localModel"
          />

          <small v-if="errors[field.key] || serverErrors?.[field.key]" class="app-form__error" role="alert">
            {{ t(errors[field.key] || serverErrors?.[field.key] || '') }}
          </small>
        </div>
      </template>
    </div>

    <div class="app-form__footer">
      <Button
        type="button"
        :label="t(config.cancelLabel ?? 'cancel')"
        severity="secondary"
        outlined
        :disabled="loading"
        @click="onCancel"
      />
      <Button type="submit" :label="t(config.submitLabel ?? 'save')" :loading="loading" />
    </div>
  </form>
</template>

<style scoped>
.app-form__grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols), 1fr);
  gap: 1.25rem;
}

.app-form__field {
  grid-column: span var(--col-span);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.app-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.app-form__error {
  font-size: 0.875rem;
  color: var(--p-red-500);
}

.app-form__checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>