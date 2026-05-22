<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";
import axiosInstance from "@/application/configs/axios";
import AppDataTable from "@/application/components/AppDataTable/AppDataTable.vue";

const { t } = useI18n();
const props = defineProps<{ bookId: number | null }>();
const visible = defineModel<boolean>("visible", { default: false });

const id = computed(() => props.bookId);

const { data, isLoading } = useQuery({
  queryKey: ["get:book-info", id],
  queryFn: async () => {
    const res = await axiosInstance.get(`most-read/book-info/${id.value}`);
    return res.data.res as Array<{
      username: string | null;
      type: string | null;
      renew_times: number;
      count: number;
    }>;
  },
  enabled: () => !!id.value,
});

const columns = computed(() => [
  { name: "User", link: "username" },
  { name: "Type", link: "type" },
  { name: t("service-desk.renew_times"), link: "renew_times" },
  { name: "Count", link: "count" },
]);
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false" style="min-width: 28rem">
    <template #header>
      <span style="font-weight: 700">Book Info</span>
    </template>

    <Skeleton v-if="isLoading" height="10rem" />

    <AppDataTable
      v-else
      :columns="columns"
      :rows="(data ?? []) as unknown as Record<string, unknown>[]"
      :show-row-numbers="false"
      :show-actions="false"
      :pagination="false"
      :sortable="false"
    />
  </Dialog>
</template>