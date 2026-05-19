<template>
  <div class="layout-container" :class="containerClass">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { containerClass } from "@/application/layouts/admin/consts/containerClass";
</script>