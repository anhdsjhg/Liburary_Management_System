<template>
  <div class="layout-footer mt-auto">
    <div class="footer-start">
      <img
        :src="
          '/images/logo/logo_inline' + (isDarkTheme ? '_orange' : '') + '.png'
        "
        alt="logo"
        class="!w-60"
      />
    </div>
    <div class="footer-right">
      <span>© SDU University</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayout } from "@/application/layouts/admin/composables/useLayout";

const { isDarkTheme } = useLayout();
</script>