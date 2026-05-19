<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-surface-100 dark:bg-surface-950"
  >
    <div
      class="flex w-11/12 flex-col bg-surface-0 px-8 py-16 shadow sm:w-[30rem] sm:px-16 dark:bg-surface-900"
      style="border-radius: 14px"
    >
        <slot></slot>

    </div>
  </div>
</template>

<script setup lang="ts">
</script>