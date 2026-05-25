<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { CatalogingMaterial } from "@/api/cataloging/search/get/types";
import type { PaginationMeta } from "@/application/types/table";
import AppPaginator from "@/application/components/AppPaginator.vue";
import AppSkeleton from "@/application/components/AppSkeleton.vue";

defineProps<{
  rows: CatalogingMaterial[];
  meta: PaginationMeta;
  page: number;
  deleteLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", row: CatalogingMaterial): void;
  (e: "show-ids", row: CatalogingMaterial): void;
  (e: "delete", row: CatalogingMaterial): void;
  (e: "update:page", page: number): void;
  (e: "refresh"): void;
}>();

const { t } = useI18n();

function stateSeverity(state: string | null) {
  if (state === "completed") return "success";
  if (state === "in_progress") return "warn";
  if (state === "not_started") return "danger";
  return "secondary";
}

function stateLabel(state: string | null) {
  const map: Record<string, string> = {
    not_started: t("cataloging.state.not_started"),
    in_progress: t("cataloging.state.in_progress"),
    completed: t("cataloging.state.completed"),
    uninventoried: t("cataloging.state.uninventoried"),
    no_lccn: t("cataloging.state.no_lccn"),
    no_genre: t("cataloging.state.no_genre"),
    no_language: t("cataloging.state.no_language"),
    wrong_language: t("cataloging.state.wrong_language"),
  };
  return map[state ?? ""] ?? (state ?? "-");
}
</script>

<template>
  <DataTable
    :value="rows"
    scrollable
    scroll-height="auto"
    size="small"
    striped-rows
  >
    <template #empty>
      <div class="p-4 text-center" style="color: var(--p-text-muted-color)">
        {{ $t("no_data") }}
      </div>
    </template>

    <Column header="#" style="min-width: 3rem; width: 3rem">
      <template #body="{ index }">
        {{ index + 1 + (page - 1) * meta.per_page }}
      </template>
    </Column>

    <Column :header="t('cataloging.state.label')" style="min-width: 8rem">
      <template #body="{ data }: { data: CatalogingMaterial }">
        <Tag
          :value="stateLabel(data.state)"
          :severity="stateSeverity(data.state)"
          style="white-space: nowrap"
        />
      </template>
    </Column>

    <Column field="isbn" header="ISBN" style="min-width: 9rem">
      <template #body="{ data }: { data: CatalogingMaterial }">
        {{ data.isbn ?? "-" }}
      </template>
    </Column>

    <Column field="call_number" :header="t('cataloging.call_number')" style="min-width: 10rem">
      <template #body="{ data }: { data: CatalogingMaterial }">
        <span style="color: var(--p-primary-color)">{{ data.call_number ?? "-" }}</span>
      </template>
    </Column>

    <Column field="title" :header="t('cataloging.title')" style="min-width: 14rem">
      <template #body="{ data }: { data: CatalogingMaterial }">
        {{ data.title ?? "-" }}
      </template>
    </Column>

    <Column field="author" :header="t('cataloging.author')" style="min-width: 12rem">
      <template #body="{ data }: { data: CatalogingMaterial }">
        {{ data.author ?? "-" }}
      </template>
    </Column>

    <Column field="publisher" :header="t('cataloging.publisher')" style="min-width: 10rem">
      <template #body="{ data }: { data: CatalogingMaterial }">
        {{ data.publisher ?? "-" }}
      </template>
    </Column>

    <Column field="year" :header="t('cataloging.year')" style="min-width: 5rem">
      <template #body="{ data }: { data: CatalogingMaterial }">
        {{ data.year ?? "-" }}
      </template>
    </Column>

    <Column style="min-width: 12rem" frozen align-frozen="right">
      <template #body="{ data }: { data: CatalogingMaterial }">
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <Button
            icon="pi pi-pencil"
            text
            rounded
            severity="secondary"
            size="small"
            @click="emit('edit', data)"
          />
          <Button
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            size="small"
            :loading="deleteLoading"
            @click="emit('delete', data)"
          />
          <Button
            :label="t('cataloging.edit_record')"
            size="small"
            outlined
            @click="emit('edit', data)"
          />
          <Button
            :label="t('cataloging.show_id_list')"
            size="small"
            outlined
            severity="secondary"
            @click="emit('show-ids', data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>

  <AppPaginator
    :meta="meta"
    :page="page"
    @update:page="emit('update:page', $event)"
  />
</template>
