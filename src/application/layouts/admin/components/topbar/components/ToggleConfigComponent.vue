<template>
  <Button
    severity="contrast"
    rounded
    type="button"
    icon="pi pi-palette"
    @click="toggleConfigSidebar"
  />
</template>

<script setup lang="ts">
import { useLayout } from "@/application/layouts/admin/composables/useLayout";

const { toggleConfigSidebar } = useLayout();
</script>