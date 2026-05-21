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
  generalDetails,
  physicalDetails,
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

const isAvailable = computed(() => (book.value?.available ?? 0) > 0);

const authorList = computed(() =>
  book.value?.author ? book.value.author.split(",").map((a) => a.trim()) : []
);
</script>

<template>
  <div class="book-detail-page">
    <!-- ── Loading ── -->
    <div v-if="isLoading" class="book-detail-page__container">
      <div class="book-detail-page__skeleton">
        <Skeleton width="220px" height="300px" border-radius="12px" />
        <div class="book-detail-page__skeleton-body">
          <Skeleton height="2rem" width="70%" />
          <Skeleton height="1rem" width="45%" class="mt-3" />
          <Skeleton height="1rem" width="60%" class="mt-2" />
          <Skeleton height="10rem" width="100%" class="mt-4" border-radius="12px" />
        </div>
      </div>
    </div>

    <!-- ── Book ── -->
    <template v-else-if="book">
      <!-- Hero band -->
      <header class="book-detail-page__hero">
        <div class="book-detail-page__container">
          <nav class="book-detail-page__breadcrumb">
            <RouterLink to="/" class="book-detail-page__breadcrumb-link">
              <i class="pi pi-home" />
              <span>{{ $t("home.home") }}</span>
            </RouterLink>
            <i class="pi pi-angle-right" />
            <span class="book-detail-page__breadcrumb-current">
              {{ book.title }}
            </span>
          </nav>

          <div class="book-detail-page__hero-grid">
            <div class="book-detail-page__type-line">
              <span v-if="book.type" class="book-detail-page__type-pill">
                {{ book.type }}
              </span>
              <span v-if="book.year" class="book-detail-page__year">{{ book.year }}</span>
            </div>

            <h1 class="book-detail-page__title">{{ book.title }}</h1>

            <p v-if="authorList.length" class="book-detail-page__author">
              {{ $t("home.by") }}
              <template v-for="(author, i) in authorList" :key="i">
                <button
                  type="button"
                  class="book-detail-page__author-link"
                  @click="searchByAuthor(author)"
                >{{ author }}</button>
                <span v-if="i !== authorList.length - 1">, </span>
              </template>
            </p>
          </div>
        </div>
      </header>

      <!-- Body -->
      <div class="book-detail-page__container book-detail-page__body">
        <!-- Sidebar -->
        <aside class="book-detail-page__sidebar">
          <div class="book-detail-page__cover-card">
            <div
              class="book-detail-page__image"
              :style="{ backgroundImage: `url(${book.image ?? ASSETS.NO_COVER})` }"
            />

            <div
              class="book-detail-page__availability"
              :class="{ 'book-detail-page__availability--out': !isAvailable }"
            >
              <i :class="isAvailable ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
              <div class="book-detail-page__availability-text">
                <span class="book-detail-page__availability-count">
                  {{ book.available ?? 0 }} / {{ book.total ?? 0 }}
                </span>
                <span class="book-detail-page__availability-label">
                  {{ $t("home.availability") }}
                </span>
              </div>
            </div>

            <div class="book-detail-page__sidebar-actions">
              <button
                type="button"
                class="book-detail-page__action"
                @click="copyLink"
              >
                <i class="pi pi-link" />
                <span>{{ $t("home.copy_link") }}</span>
              </button>
              <button
                type="button"
                class="book-detail-page__action"
                @click="printPage"
              >
                <i class="pi pi-print" />
                <span>{{ $t("home.print_page") }}</span>
              </button>
            </div>
          </div>

          <!-- Quick facts -->
          <div
            v-if="book.call_number || book.location || book.language_title || book.language"
            class="book-detail-page__facts"
          >
            <h3 class="book-detail-page__facts-title">
              {{ $t("home.quick_facts") }}
            </h3>
            <dl class="book-detail-page__facts-list">
              <template v-if="book.call_number">
                <dt>{{ $t("home.call_number") }}</dt>
                <dd>{{ book.call_number }}</dd>
              </template>
              <template v-if="book.location">
                <dt>{{ $t("home.location") }}</dt>
                <dd>
                  <i class="pi pi-map-marker" />
                  {{ book.location }}
                </dd>
              </template>
              <template v-if="book.language_title || book.language">
                <dt>{{ $t("home.language") }}</dt>
                <dd>{{ book.language_title ?? book.language }}</dd>
              </template>
            </dl>
          </div>
        </aside>

        <!-- Main content -->
        <main class="book-detail-page__content">
          <!-- Description -->
          <section v-if="description" class="book-detail-page__section">
            <h2 class="book-detail-page__section-title">
              {{ $t("home.description") }}
            </h2>
            <div class="book-detail-page__prose" v-html="description" />
          </section>

          <!-- Content / TOC -->
          <section v-if="content" class="book-detail-page__section">
            <h2 class="book-detail-page__section-title">
              {{ $t("home.content") }}
            </h2>
            <div class="book-detail-page__prose" v-html="displayedContent" />
            <button
              type="button"
              class="book-detail-page__expand-link"
              @click="contentExpanded = !contentExpanded"
            >
              {{ contentExpanded ? $t("home.shrink") : $t("home.expand") }}
              <i
                class="pi"
                :class="contentExpanded ? 'pi-chevron-up' : 'pi-chevron-down'"
              />
            </button>
          </section>

          <!-- Subject terms -->
          <section v-if="subjectTerms.length" class="book-detail-page__section">
            <h2 class="book-detail-page__section-title">
              {{ $t("home.subject_terms") }}
            </h2>
            <div class="book-detail-page__chips">
              <button
                v-for="term in subjectTerms"
                :key="term"
                type="button"
                class="book-detail-page__chip"
                @click="searchByTerm(term)"
              >
                <i class="pi pi-tag" />
                <span>{{ term }}</span>
              </button>
            </div>
          </section>

          <!-- General details -->
          <section v-if="generalDetails.length" class="book-detail-page__section">
            <h2 class="book-detail-page__section-title">
              {{ $t("home.general_details") }}
            </h2>
            <dl class="book-detail-page__details">
              <template v-for="row in generalDetails" :key="row.key">
                <dt>{{ $t(row.key) }}</dt>
                <dd>
                  <template v-if="row.key === 'home.author' && row.value">
                    <template
                      v-for="(author, i) in row.value.split(',')"
                      :key="i"
                    >
                      <button
                        type="button"
                        class="book-detail-page__author-link"
                        @click="searchByAuthor(author)"
                      >{{ author.trim() }}</button>
                      <span v-if="i !== row.value.split(',').length - 1">, </span>
                    </template>
                  </template>
                  <template v-else>{{ row.value }}</template>
                </dd>
              </template>
            </dl>
          </section>

          <!-- Physical details -->
          <section v-if="physicalDetails.length" class="book-detail-page__section">
            <h2 class="book-detail-page__section-title">
              {{ $t("home.physical_details") }}
            </h2>
            <dl class="book-detail-page__details">
              <template v-for="row in physicalDetails" :key="row.key">
                <dt>{{ $t(row.key) }}</dt>
                <dd>{{ row.value }}</dd>
              </template>
            </dl>
          </section>
        </main>
      </div>
    </template>

    <!-- ── Empty ── -->
    <div v-else class="book-detail-page__container">
      <div class="book-detail-page__empty">
        <i class="pi pi-book book-detail-page__empty-icon" />
        <h3>{{ $t("home.book_not_found") }}</h3>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/application/assets/scss/modules/home/_book-search-page.scss";
</style>
