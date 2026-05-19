<script setup lang="ts">
import { useArrivalsAll } from "./composables/useComposable";

const { arrivals, isLoading, getImageUrl, goToBook } = useArrivalsAll();
</script>

<template>
  <div class="arrivals-all-page">
    <h1 class="arrivals-all-page__title">
      {{ $t("website.new_arrivals") }}
    </h1>

    <Skeleton v-if="isLoading" height="24rem" />

    <div v-else class="arrivals-all-page__grid">
      <div
        v-for="arrival in arrivals"
        :key="arrival.id"
        class="arrival-card"
      >
        
          class="arrival-card__image"
          :style="{ backgroundImage: `url(${getImageUrl(arrival)})` }"
          @click="goToBook(arrival.id)"
        />
        <div class="arrival-card__title">{{ arrival.title }}</div>
        <div v-if="arrival.author" class="arrival-card__author">
          {{ arrival.author }}
        </div>
        <a class="arrival-card__link" @click="goToBook(arrival.id)">
          {{ $t("home.show_details") }}
        </a>
      </div>
    </div>
  </div>
</template>