<script setup lang="ts">
import { computed, ref } from "vue";
import { useBookDetail } from "./composables/useComposable";
import { ASSETS } from "@/application/configs/constants";

const {
  book,
  isLoading,
  description,
  content,
  subjectTerms,
  searchByAuthor,
  searchByTerm,
  copyLink,
  printPage,
} = useBookDetail();

const contentExpanded = ref(false);

const displayedContent = computed(() => {
  if (!content.value) return "";
  const parts = content.value.split("--");
  return contentExpanded.value
    ? parts.join("<br>")
    : parts.slice(0, 2).join("--");
});
</script>

<template>
  <div class="book-detail-page">
    <Skeleton v-if="isLoading" height="30rem" />

    <div v-else-if="book" class="book-detail-page__body">
      <div class="book-detail-page__image"
        :style="{
          backgroundImage: `url(${book.image ?? ASSETS.NO_COVER})`
        }"
      />

      <div class="book-detail-page__info">
        <div class="book-detail-page__title">{{ book.title }}</div>

        <div v-if="book.author" class="book-detail-page__author">
          <span
            v-for="(author, i) in book.author.split(',')"
            :key="i"
            @click="searchByAuthor(author)"
          >
            {{ author.trim()
            }}<span v-if="i !== book.author.split(',').length - 1">, </span>
          </span>
          <span v-if="book.year">, {{ book.year }}</span>
        </div>

        <div class="book-detail-page__badges">
          <span v-if="book.type" class="book-detail-page__badge">
            {{ $t(book.type) }}
          </span>
          <span v-if="book.call_number" class="book-detail-page__badge">
            {{ book.call_number }}
          </span>
          <span v-if="book.location" class="book-detail-page__badge">
            {{ book.location }}
          </span>
        </div>

        <div class="book-detail-page__availability">
          {{ book.available ?? 0 }} / {{ book.total ?? 0 }}
          {{ $t("home.availability") }}
        </div>

        <div v-if="description" class="book-detail-page__description">
          <div class="book-detail-page__section-title">
            {{ $t("home.description") }}
          </div>
          <div v-html="description" />
        </div>

        <div v-if="content" class="book-detail-page__description">
          <div class="book-detail-page__section-title">
            {{ $t("home.content") }}
          </div>
          <div v-html="displayedContent" />
          <span
            class="book-detail-page__expand-link"
            @click="contentExpanded = !contentExpanded"
          >
            {{ contentExpanded ? $t("home.shrink") : $t("home.expand") }}
          </span>
        </div>

        <div v-if="subjectTerms.length" class="book-detail-page__subject-terms">
          <div class="book-detail-page__section-title">
            {{ $t("home.subject_terms") }}
          </div>
          <div class="book-detail-page__subject-terms">
            <Button
              v-for="term in subjectTerms"
              :key="term"
              :label="term"
              severity="info"
              outlined
              size="small"
              @click="searchByTerm(term)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>