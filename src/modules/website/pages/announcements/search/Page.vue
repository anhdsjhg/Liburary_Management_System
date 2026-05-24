<script setup lang="ts">
import { onMounted } from "vue";
import { useAnnouncementsSearch } from "./composables/useComposable";
import AppPaginator from "@/application/components/AppPaginator.vue";
import { RouteNames } from "@/application/router/routeNames";
import { buildBackendImageUrl } from "@/application/configs/constants";

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
} = useAnnouncementsSearch();

onMounted(() => search(1));
</script>

<template>
  <div class="announcements-page">
    <div class="announcements-page__body">
      <aside class="announcements-page__filter">
        <div class="announcements-page__filter-title">
          {{ $t("website.filter") }}
        </div>

        <div>
          <div class="announcements-page__filter-label">
            {{ $t("website.start_date") }}
          </div>
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
          <div class="announcements-page__filter-label">
            {{ $t("website.end_date") }}
          </div>
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
          class="announcements-page__filter-apply"
          @click="applyFilter"
        />
        <Button
          :label="$t('website.reset')"
          severity="secondary"
          outlined
          class="announcements-page__filter-apply"
          @click="resetFilter"
        />
      </aside>

      <div class="announcements-page__results">
        <div class="announcements-page__meta">
          {{ results.total }} {{ $t("website.results") }},
          {{ results.last_page }} {{ $t("website.pages") }}
        </div>

        <Skeleton v-if="isLoading" height="24rem" />

        <template v-else>
          <div
            v-if="results.data.length === 0"
            class="announcements-page__empty"
          >
            {{ $t("website.no_events") }}
          </div>

          <div v-else class="announcements-page__grid">
            <div
              v-for="item in results.data"
              :key="item.announcement_id"
              class="website-event-card"
            >
              <div
                class="website-event-card__image"
                :style="
                  item.image ? { backgroundImage: `url(${buildBackendImageUrl(item.image)})` } : {}
                "
              />

              <div class="website-event-card__body">
                <div class="website-event-card__date-row">
                  {{ formatDate(item.start_date) }}
                  <span v-if="item.end_date">
                    — {{ formatDate(item.end_date) }}
                  </span>
                </div>

                <router-link
                  :to="{
                    name: RouteNames.WEBSITE_EVENT_DETAIL,
                    params: { id: item.announcement_id },
                  }"
                  class="website-event-card__title"
                >
                  {{ getLocalizedTitle(item) }}
                </router-link>

                <div
                  v-if="getLocalizedPlace(item)"
                  class="website-event-card__place"
                >
                  {{ getLocalizedPlace(item) }}
                </div>

                <div
                  v-if="item.start_time"
                  class="website-event-card__time"
                >
                  {{ item.start_time }}
                  <span v-if="item.end_time">— {{ item.end_time }}</span>
                </div>

                <div class="website-event-card__divider" />

                <router-link
                  :to="{
                    name: RouteNames.WEBSITE_EVENT_DETAIL,
                    params: { id: item.announcement_id },
                  }"
                  class="website-event-card__footer"
                >
                  <span>
                    {{
                      $t(
                        item.type === "event"
                          ? "website.event"
                          : "website.announcement"
                      )
                    }}
                  </span>
                  <i class="pi pi-arrow-right" />
                </router-link>
              </div>
            </div>
          </div>

          <AppPaginator
            v-if="hasPagination"
            class="announcements-page__pagination"
            :meta="paginationMeta"
            :page="currentPage"
            @update:page="onPageChange"
          />
        </template>
      </div>
    </div>
  </div>
</template>