<script setup lang="ts">
import { onMounted } from "vue";
import { useEventsSearch } from "./composables/useComposable";
import AppPaginator from "@/application/components/AppPaginator.vue";
import { RouteNames } from "@/application/router/routeNames";

const {
  filter,
  results,
  isLoading,
  paginationMeta,
  hasPagination,
  currentPage,
  search,
  applyFilter,
  resetFilter,
  onPageChange,
  getLocalizedTitle,
  getLocalizedPlace,
  formatDate,
} = useEventsSearch();

onMounted(() => search(1));
</script>

<template>
  <div class="events-page">
    <div class="events-page__body">
      <aside class="events-page__filter">
        <div class="events-page__filter-title">{{ $t("website.filter") }}</div>

        <div>
          <div class="events-page__filter-label">{{ $t("website.start_date") }}</div>
          <div class="p-field">
            <label>{{ $t("common.from") }}</label>
            <InputText
              v-model="filter.start_date.from"
              type="date"
              class="w-full"
            />
          </div>
          <div class="p-field">
            <label>{{ $t("common.until") }}</label>
            <InputText
              v-model="filter.start_date.to"
              type="date"
              class="w-full"
            />
          </div>
        </div>

        <div>
          <div class="events-page__filter-label">{{ $t("website.end_date") }}</div>
          <div class="p-field">
            <label>{{ $t("common.until") }}</label>
            <InputText
              v-model="filter.end_date.to"
              type="date"
              class="w-full"
            />
          </div>
        </div>

        <Button
          :label="$t('website.apply')"
          class="events-page__filter-apply"
          @click="applyFilter"
        />
        <Button
          :label="$t('website.reset')"
          severity="secondary"
          outlined
          class="events-page__filter-apply"
          @click="resetFilter"
        />
      </aside>

      <div class="events-page__results">
        <div class="events-page__meta">
          {{ results.total }} {{ $t("website.results") }},
          {{ results.last_page }} {{ $t("website.pages") }}
        </div>

        <Skeleton v-if="isLoading" height="24rem" />

        <template v-else>
          <div v-if="results.data.length === 0" class="events-page__empty">
            {{ $t("website.no_events") }}
          </div>

          <div v-else class="events-page__grid">
            <div
              v-for="event in results.data"
              :key="event.announcement_id"
              class="website-event-card"
            >
              <div
                class="website-event-card__image"
                :style="event.image ? { backgroundImage: `url(${event.image})` } : {}"
              />

              <div class="website-event-card__body">
                <div class="website-event-card__date-row">
                  {{ formatDate(event.start_date) }}
                  <span v-if="event.end_date">
                    — {{ formatDate(event.end_date) }}
                  </span>
                </div>

                <component
                  :is="event.link ? 'a' : 'router-link'"
                  :href="event.link ?? undefined"
                  :to="event.link ? undefined : {
                    name: RouteNames.WEBSITE_EVENT_DETAIL,
                    params: { id: event.announcement_id }
                  }"
                  :target="event.link ? '_blank' : undefined"
                  class="website-event-card__title"
                >
                  {{ getLocalizedTitle(event) }}
                </component>

                <div v-if="getLocalizedPlace(event)" class="website-event-card__place">
                  {{ getLocalizedPlace(event) }}
                </div>

                <div v-if="event.start_time" class="website-event-card__time">
                  {{ event.start_time }}
                  <span v-if="event.end_time">— {{ event.end_time }}</span>
                </div>

                <div class="website-event-card__divider" />

                <component
                  :is="event.link ? 'a' : 'router-link'"
                  :href="event.link ?? undefined"
                  :to="event.link ? undefined : {
                    name: RouteNames.WEBSITE_EVENT_DETAIL,
                    params: { id: event.announcement_id }
                  }"
                  :target="event.link ? '_blank' : undefined"
                  class="website-event-card__footer"
                >
                  <span>
                    {{ $t(event.type === "event" ? "website.event" : "website.announcement") }}
                  </span>
                  <i class="pi pi-arrow-right" />
                </component>
              </div>
            </div>
          </div>

          <AppPaginator
            v-if="hasPagination"
            class="events-page__pagination"
            :meta="paginationMeta"
            :page="currentPage"
            @update:page="onPageChange"
          />
        </template>
      </div>
    </div>
  </div>
</template>