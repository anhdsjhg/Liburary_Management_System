<script setup lang="ts">
import { ref, computed } from "vue";
import type { MarcField } from "@/api/cataloging/[id]/get/types";

const props = defineProps<{
  fields: MarcField[];
}>();

const emit = defineEmits<{
  (e: "update:fields", fields: MarcField[]): void;
}>();

const searchQuery = ref("");

const localFields = computed(() => {
  if (!searchQuery.value.trim()) return props.fields;
  const q = searchQuery.value.toLowerCase();
  return props.fields.filter(
    (f) =>
      f.id?.toLowerCase().includes(q) ||
      f.title?.toLowerCase().includes(q) ||
      f.data?.toLowerCase().includes(q)
  );
});

function isParent(field: MarcField): boolean {
  return !field.pid;
}

function updateField(fieldId: string, key: keyof MarcField, value: string) {
  const updated: MarcField[] = props.fields.map((f) => {
    if (f.id !== fieldId) return f;
    return {
      id: f.id,
      pid: f.pid,
      field_code: f.field_code,
      ind1: f.ind1,
      ind2: f.ind2,
      title: f.title,
      data: f.data,
      repeatable: f.repeatable,
      [key]: value,
    };
  });
  emit("update:fields", updated);
}
</script>

<template>
  <div class="marc-fields-editor">
    <div class="marc-fields-editor__toolbar">
      <InputText
        v-model="searchQuery"
        :placeholder="$t('cataloging.search')"
        class="marc-fields-editor__search"
      />
    </div>

    <div style="overflow-x: auto">
      <table class="marc-fields-editor__table">
        <thead>
          <tr>
            <th class="marc-fields-editor__th">{{ $t("cataloging.field_id") }}</th>
            <th class="marc-fields-editor__th">{{ $t("cataloging.field_ind1") }}</th>
            <th class="marc-fields-editor__th">{{ $t("cataloging.field_ind2") }}</th>
            <th class="marc-fields-editor__th">{{ $t("cataloging.field_title") }}</th>
            <th class="marc-fields-editor__th" style="min-width: 20rem">
              {{ $t("cataloging.field_data") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(field, idx) in localFields"
            :key="idx"
            class="marc-fields-editor__tr"
            :class="{
              'marc-fields-editor__tr--parent': isParent(field),
              'marc-fields-editor__tr--child': !isParent(field),
            }"
          >
            <td class="marc-fields-editor__td">
              <span
                class="marc-fields-editor__field-id"
                :class="{ 'marc-fields-editor__indent': !isParent(field) }"
              >
                {{ field.id }}
              </span>
            </td>
            <td class="marc-fields-editor__td">
              <input
                class="marc-fields-editor__input"
                :value="field.ind1 ?? ''"
                @input="updateField(field.id, 'ind1', ($event.target as HTMLInputElement).value)"
              />
            </td>
            <td class="marc-fields-editor__td">
              <input
                class="marc-fields-editor__input"
                :value="field.ind2 ?? ''"
                @input="updateField(field.id, 'ind2', ($event.target as HTMLInputElement).value)"
              />
            </td>
            <td class="marc-fields-editor__td">{{ field.title }}</td>
            <td class="marc-fields-editor__td">
              <input
                class="marc-fields-editor__input"
                :value="field.data ?? ''"
                @input="updateField(field.id, 'data', ($event.target as HTMLInputElement).value)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>