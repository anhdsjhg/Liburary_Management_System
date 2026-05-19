<script setup lang="ts">
import { useArrivalManageDialog } from "./composables/useComposable";

const visible = defineModel<boolean>("visible", { default: false });
const emit = defineEmits<{ (e: "success"): void }>();

const { form, isCreating, save } = useArrivalManageDialog(() => {
  visible.value = false;
  emit("success");
});
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :draggable="false" style="min-width: 28rem">
    <template #header>
      <span style="font-weight: 700">{{ $t("settings.add") }} — {{ $t("settings.arrivals") }}</span>
    </template>

    <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem">
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.inv_id") }}</div>
        <InputText v-model="form.inv_id" class="w-full" />
      </div>
      <div class="settings-manage-page__field">
        <div class="settings-manage-page__label">{{ $t("settings.image") }} URL</div>
        <InputText v-model="form.image_url" class="w-full" />
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end">
        <Button :label="$t('settings.cancel')" severity="secondary" outlined @click="visible = false" />
        <Button :label="$t('settings.save')" :loading="isCreating" @click="save" />
      </div>
    </div>
  </Dialog>
</template>