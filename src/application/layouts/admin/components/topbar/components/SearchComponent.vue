<template>
  <div class="topbar-search" :class="{ 'topbar-search-active': searchActive }">
    <Button
      severity="secondary"
      rounded
      type="button"
      icon="pi pi-search"
      @click="activateSearch"
    />
    <div class="search-input-wrapper">
      <IconField>
        <InputText
          class="searchInput"
          type="text"
          placeholder="Search"
          @blur="deactivateSearch"
          @keydown.escape="deactivateSearch"
        />
        <InputIcon class="pi pi-search" />
      </IconField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const searchActive = ref(false);

function activateSearch() {
  searchActive.value = true;

  setTimeout(() => {
    const input = document.querySelector(".searchInput") as HTMLElement;
    if (input) input.focus();
  }, 100);
}

function deactivateSearch() {
  searchActive.value = false;
}
</script>