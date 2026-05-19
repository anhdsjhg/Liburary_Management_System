import { ref, watch } from "vue";
import type { MarcField } from "@/api/cataloging/[id]/get/types";

export function useMarcFieldsForm(initialFields: MarcField[] = []) {
  const fields = ref<MarcField[]>([...initialFields]);
  const isDirty = ref(false);

  function setFields(newFields: MarcField[]) {
    fields.value = [...newFields];
    isDirty.value = false;
  }

  function updateFields(newFields: MarcField[]) {
    fields.value = newFields;
    isDirty.value = true;
  }

  function toUpdatePayload(): MarcField[] {
    return fields.value;
  }

  return { fields, isDirty, setFields, updateFields, toUpdatePayload };
}