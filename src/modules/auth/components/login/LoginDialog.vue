<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/application/stores/auth.store";
import { useLoginForm } from "./composables/useFormComposable";
import { useAuthLogin } from "./composables/useAuthLogin";

const authStore = useAuthStore();
const { loginVisible } = storeToRefs(authStore);

const { form, errors, validate, reset } = useLoginForm();
const { isSubmitting, submitLogin } = useAuthLogin(() => reset());

function handleSubmit(): void {
  if (!validate()) return;
  submitLogin(form);
}

function handleCancel(): void {
  reset();
  loginVisible.value = false;
}
</script>


<template>
  <Dialog v-model:visible="loginVisible" :modal="true" :draggable="false" :style="{ width: '22rem' }">
    <template #header>
      <span class="login-dialog__title">{{ $t("auth.login") }}</span>
    </template>

    <form class="login-dialog" novalidate @submit.prevent="handleSubmit">
      <p class="login-dialog__hint">* {{ $t("auth.portal_credentials") }}</p>

      <div class="p-field">
        <label for="dialog-login">{{ $t("auth.username") }}</label>
        <InputText
          id="dialog-login"
          v-model="form.username"
          autocomplete="username"
          :class="{ 'p-invalid': errors.username }"
          class="w-full"
        />
        <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
      </div>

      <div class="p-field">
        <label for="dialog-password">{{ $t("auth.password") }}</label>
        <Password
          id="dialog-password"
          v-model="form.password"
          :feedback="false"
          toggle-mask
          autocomplete="current-password"
          :class="{ 'p-invalid': errors.password }"
          input-class="w-full"
        />
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
      </div>

      <div class="login-dialog__actions">
        <Button
          type="submit"
          :label="isSubmitting ? $t('auth.logging_in') : $t('auth.login')"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          class="w-full"
        />
        <Button
          type="button"
          :label="$t('auth.cancel')"
          severity="secondary"
          outlined
          class="w-full"
          @click="handleCancel"
        />
      </div>
    </form>
  </Dialog>
</template>