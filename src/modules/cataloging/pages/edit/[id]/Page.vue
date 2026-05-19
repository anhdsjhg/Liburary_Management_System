<script setup lang="ts">
import { onMounted } from "vue";
import { useCatalogingEdit } from "./composables/useComposable";
import MarcFieldsEditor from "./components/marcFieldsEditor/MarcFieldsEditor.vue";
import PreviewPanel from "./components/previewPanel/PreviewPanel.vue";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";

const {
  id,
  type,
  image,
  state,
  createdBy,
  createdAt,
  fields,
  isDirty,
  isLoading,
  isSaving,
  isDeleting,
  historyItems,
  updateFields,
  save,
  markComplete,
  exportXml,
  onDelete,
  cancel,
  loadHistory,
} = useCatalogingEdit();

onMounted(() => loadHistory());
</script>

<template>
  <div class="cataloging-edit-page">
    <div class="cataloging-edit-page__header">
      <span class="cataloging-edit-page__title">
        {{ $t("cataloging.title") }} — {{ type }} #{{ id }}
      </span>

      <div class="cataloging-edit-page__actions">
        <Button
          :label="$t('cataloging.export_xml')"
          severity="secondary"
          outlined
          icon="pi pi-download"
          @click="exportXml"
        />
        <Button
          :label="$t('cataloging.complete')"
          severity="success"
          outlined
          icon="pi pi-check"
          :disabled="state === 'completed'"
          @click="markComplete"
        />
        <Button
          :label="$t('cataloging.delete')"
          severity="danger"
          outlined
          icon="pi pi-trash"
          :loading="isDeleting"
          @click="onDelete"
        />
        <Button
          :label="$t('cataloging.cancel')"
          severity="secondary"
          outlined
          @click="cancel"
        />
        <Button
          :label="$t('cataloging.save')"
          icon="pi pi-save"
          :loading="isSaving"
          :disabled="!isDirty"
          @click="save"
        />
      </div>
    </div>

    <Skeleton v-if="isLoading" height="30rem" />

    <div v-else class="cataloging-edit-page__body">
      <PreviewPanel
        :image="image"
        :id="id"
        :type="type"
        :state="state"
        :created-by="createdBy"
        :created-at="createdAt"
      />

      <div class="cataloging-edit-page__editor">
        <MarcFieldsEditor
          :fields="fields"
          @update:fields="updateFields"
        />

        <div v-if="historyItems.length" style="margin-top: 1.5rem">
          <div style="font-weight: 700; margin-bottom: 0.75rem">
            {{ $t("cataloging.history") }}
          </div>
          <AppDataTable
            v-if="historyItems.length"
            style="margin-top: 1.5rem"
            :columns="[
                { name: $t('cataloging.made_by'), link: 'made_by' },
                { name: $t('cataloging.made_at'), link: 'made_at' },
            ]"
            :rows="historyItems as unknown as Record<string, unknown>[]"
            :show-row-numbers="false"
            :show-actions="false"
            :pagination="false"
            :sortable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>