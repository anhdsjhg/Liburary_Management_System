<template>
  <div class="public-layout">
    <header class="public-layout__header">
      <div class="public-layout__header-inner">
        <router-link to="/" class="public-layout__logo">
          <img src="./assets/images/logo_horizontal.png" alt="SDU Library" class="public-layout__logo-img" />
        </router-link>
        <div class="public-layout__header-actions">
          <LocaleSelector />
          <ProfileComponent />
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">    
import LocaleSelector from "@/application/layouts/admin/components/topbar/components/LocaleSelector.vue";
import ProfileComponent from "@/application/layouts/admin/components/topbar/components/ProfileComponent.vue";
</script>

<style scoped>
.public-layout__header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  padding: 1rem 3rem;
}

.public-layout__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1600px;
  margin: 0 auto;
}

.public-layout__logo-img {
  height: 3.5rem;
  object-fit: contain;
}

.public-layout__header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
</style>