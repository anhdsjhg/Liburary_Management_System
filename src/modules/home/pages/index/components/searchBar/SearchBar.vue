<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { RouteNames } from "@/application/router/routeNames";

const router = useRouter();
const { t } = useI18n();

const activeTab = ref<"books" | "eresources">("books");
const selectedType = ref("all");
const query = ref("");

const searchTypes = computed(() => [
  { label: t("home.search_books"), value: "all" },
  { label: "Title", value: "title" },
  { label: "Author", value: "author" },
  { label: "ISBN", value: "isbn" },
]);

function search() {
  if (!query.value.trim()) return;
  router.push({
    name: RouteNames.WEBSITE_SEARCH,
    query: {
      q: query.value,
      key: selectedType.value,
    },
  });
}
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__tabs">
      <span
        class="search-bar__tab"
        :class="{ 'search-bar__tab--active': activeTab === 'books' }"
        @click="activeTab = 'books'"
      >
        {{ $t("home.books_and_media") }}
      </span>
      <span
        class="search-bar__tab"
        :class="{ 'search-bar__tab--active': activeTab === 'eresources' }"
        @click="activeTab = 'eresources'"
      >
        {{ $t("home.eresources") }}
      </span>
    </div>

    <template v-if="activeTab === 'books'">
      <form class="search-bar__input-row" @submit.prevent="search">
        <Select
          v-model="selectedType"
          :options="searchTypes"
          option-label="label"
          option-value="value"
          class="search-bar__type-select"
        />
        <InputText
          v-model="query"
          :placeholder="$t('home.search_books')"
          class="search-bar__input"
        />
        <Button
          type="submit"
          :label="$t('common.search')"
          class="search-bar__submit"
        />
      </form>
    </template>

    <template v-else>
      <form
        action="https://searchbox.ebsco.com/search/"
        target="_blank"
        class="search-bar__input-row"
      >
        <input type="hidden" name="schemaId" value="search" />
        <input type="hidden" name="custid" value="ns242285" />
        <input type="hidden" name="groupid" value="main" />
        <input type="hidden" name="profid" value="eds" />
        <input type="hidden" name="authtype" value="ip,guest" />
        <input type="hidden" name="scope" value="site" />
        <input type="hidden" name="site" value="eds-live" />
        <input type="hidden" name="direct" value="true" />
        <InputText
          name="bquery"
          :placeholder="$t('home.search_eresources')"
          class="search-bar__input"
        />
        <Button
          type="submit"
          :label="$t('common.search')"
          class="search-bar__submit"
        />
      </form>
    </template>
  </div>
</template>