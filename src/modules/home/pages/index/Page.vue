<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/application/stores/auth.store";
// import { storeToRefs } from "pinia";
import { useHomeIndex } from "./composables/useComposables";
import { useAuthLogout } from "@/modules/auth/components/login/composables/useAuthLogin";
import { EPermissions } from "@/application/enums/permissions";
import { RouteNames } from "@/application/router/routeNames";
import SearchBar from "./components/searchBar/SearchBar.vue";
import ArrivalsGlider from "./components/arrivalsGlider/ArrivalsGlider.vue";
import EventCard from "./components/eventCard/EventCard.vue";
import VideoBlock from "./components/videoBlock/VideoBlock.vue";
import LoginDialog from "@/modules/auth/components/login/LoginDialog.vue";

const { locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
// const { user, userDisplayName, loginVisible } = storeToRefs(authStore);
const { submitLogout } = useAuthLogout();

const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

const hasAdminAccess = computed(() => authStore.moduleRouteNames?.length > 0);

function goToAdmin() {
  userMenuOpen.value = false;
  const modules = authStore.moduleRouteNames;

  if (modules.includes(EPermissions.batches)) {
    router.push("/admin/acquisition/acts");
  } else if (modules.includes(EPermissions.serviceDesk)) {
    router.push("/admin/service-desk/users");
  } else if (modules.includes(EPermissions.cataloging)) {
    router.push("/admin/cataloging/search");
  } else if (modules.includes(EPermissions.report)) {
    router.push("/admin/reports/inventory-books");
  } else if (modules.includes(EPermissions.website)) {
    router.push("/admin/settings/announcements");
  } else if (modules.includes(EPermissions.admin)) {
    router.push("/admin/permissions");
  }
}

function handleLogout() {
  userMenuOpen.value = false;
  submitLogout();
}

const locales = [
  { label: "EN", value: "en" },
  { label: "RU", value: "ru" },
  { label: "KZ", value: "kz" },
];

const {
  arrivals, events, videos,
  backgroundImages, currentBgIndex, nextBgIndex, isFading,
  arrivalsLoading, eventsLoading, videosLoading,
  quickLinks
} = useHomeIndex();

const videoCarouselOptions = [
  { breakpoint: "1024px", numVisible: 2, numScroll: 1 },
  { breakpoint: "560px", numVisible: 1, numScroll: 1 },
];

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDay = ref<number | null>(null);

const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const calendarTitle = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value);
  return date.toLocaleString("en", { month: "long", year: "numeric" });
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  const day = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return day === 0 ? 6 : day - 1;
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  selectedDay.value = null;
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  selectedDay.value = null;
}

function isToday(day: number) {
  return day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear();
}

function hasEvent(day: number) {
  return events.value.some(e => {
    const d = new Date(e.start_date);
    return d.getDate() === day &&
      d.getMonth() === currentMonth.value &&
      d.getFullYear() === currentYear.value;
  });
}

const filteredEvents = computed(() => {
  if (selectedDay.value) {
    return events.value.filter(e => {
      const d = new Date(e.start_date);
      return d.getDate() === selectedDay.value &&
        d.getMonth() === currentMonth.value &&
        d.getFullYear() === currentYear.value;
    });
  }
  return events.value;
});

const monthEvents = computed(() => {
  return events.value.filter(e => {
    const d = new Date(e.start_date);
    return d.getMonth() === currentMonth.value &&
      d.getFullYear() === currentYear.value;
  }).sort((a, b) => new Date(a.start_date).getDate() - new Date(b.start_date).getDate());
});
</script>

<template>
  <div class="home-landing">
    <!-- Hero -->
    <div class="home-landing__hero">
      <!-- Фиолетовая полоска с приветствием -->
      <div class="home-landing__hero-banner">
        <h1 class="home-landing__hero-title">
          {{ $t("home.welcome_to") }}
          <span class="home-landing__hero-title-accent">{{ $t("home.university_name") }}</span>
        </h1>
      </div>

      <!-- Фото с поиском -->
      <div class="home-landing__hero-photo">
        <div v-if="backgroundImages.length > 0" class="home-landing__bg"
          :style="{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }" />
        <div v-if="backgroundImages.length > 1" class="home-landing__bg"
          :class="{ 'home-landing__bg--fade': isFading }"
          :style="{ backgroundImage: `url(${backgroundImages[nextBgIndex]})` }" />
        <div class="home-landing__hero-search-wrapper">
          <SearchBar class="home-landing__search" />
        </div>
      </div>
    </div>

    <!-- Library Services -->
    <section class="home-landing__section home-landing__section--white">
      <div class="home-landing__container">
        <h2 class="home-landing__section-title">{{ $t("home.library_services") }}</h2>
        <div class="home-landing__services-grid">
          <a
            v-for="link in quickLinks"
            :key="link.link"
            :href="link.link"
            target="_blank"
            class="home-landing__service-card"
          >
            <div class="home-landing__service-icon">
              <i class="pi pi-link" />
            </div>
            <div class="home-landing__service-body">
              <div class="home-landing__service-title">
                {{ (link as any)[`title_${locale}`] ?? link.title_en }}
              </div>
              <div class="home-landing__service-desc">
                {{ (link as any)[`description_${locale}`] ?? link.description_en }}
              </div>
            </div>
            <i class="pi pi-arrow-right home-landing__service-arrow" />
          </a>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="home-landing__section home-landing__section--grey">
      <div class="home-landing__container">
        <div class="home-landing__section-header">
          <h2 class="home-landing__section-title">{{ $t("home.new_arrivals") }}</h2>
          <router-link :to="{ name: RouteNames.HOME_ARRIVALS }" class="home-landing__see-all">
            {{ $t("home.show_more") }} <i class="pi pi-arrow-right" />
          </router-link>
        </div>
        <Skeleton v-if="arrivalsLoading" height="18rem" />
        <ArrivalsGlider v-else :arrivals="arrivals" />
      </div>
    </section>

    <!-- Upcoming Events -->
    <section class="home-landing__section home-landing__section--white">
      <div class="home-landing__container">
        <div class="home-landing__section-header">
          <h2 class="home-landing__section-title">{{ $t("home.upcoming_events") }}</h2>
          <router-link :to="{ name: RouteNames.HOME_EVENTS }" class="home-landing__see-all">
            {{ $t("home.see_all_events") }} <i class="pi pi-arrow-right" />
          </router-link>
        </div>
        <Skeleton v-if="eventsLoading" height="18rem" />
        <div v-else class="home-landing__events-layout">
          <!-- Календарь -->
          <div class="home-landing__calendar">
            <div class="home-landing__calendar-header">
              <button @click="prevMonth"><i class="pi pi-chevron-left" /></button>
              <span>{{ calendarTitle }}</span>
              <button @click="nextMonth"><i class="pi pi-chevron-right" /></button>
            </div>
            <div class="home-landing__calendar-grid">
              <div v-for="day in weekDays" :key="day" class="home-landing__calendar-weekday">{{ day }}</div>
              <div v-for="blank in firstDayOfMonth" :key="'b' + blank" class="home-landing__calendar-day" />
              <div
                v-for="day in daysInMonth"
                :key="day"
                class="home-landing__calendar-day"
                :class="{
                  'home-landing__calendar-day--today': isToday(day),
                  'home-landing__calendar-day--has-event': hasEvent(day),
                  'home-landing__calendar-day--selected': selectedDay === day,
                }"
                @click="selectedDay = day"
              >
                {{ day }}
                <span v-if="hasEvent(day)" class="home-landing__calendar-dot" />
              </div>
            </div>

            <!-- Список ивентов текущего месяца -->
            <div class="home-landing__calendar-events">
              <template v-if="monthEvents.length > 0">
                <a
                  v-for="event in monthEvents"
                  :key="event.announcement_id"
                  :href="event.link ?? `/events/${event.announcement_id}`"
                  :target="event.link ? '_blank' : undefined"
                  class="home-landing__calendar-event-item"
                >
                  <div class="home-landing__calendar-event-date">
                    {{ new Date(event.start_date).getDate() }}
                  </div>
                  <div class="home-landing__calendar-event-info">
                    <div class="home-landing__calendar-event-title">
                      {{ (event as any)[`title_${locale}`] ?? event.title_en }}
                    </div>
                    <div class="home-landing__calendar-event-time">
                      {{ event.start_time }}
                      <span v-if="event.start_time"> · {{ (event as any)[`place_${locale}`] ?? event.place_en }}</span>
                    </div>
                  </div>
                </a>
              </template>
              <div v-else style="font-size: 0.8rem; color: var(--text-color-secondary); text-align: center; padding: 0.5rem;">
                {{ $t("home.no_events") }}
              </div>
            </div>
          </div>

          <!-- Карточки ивентов -->
          <div class="home-landing__events-list">
            <div v-if="filteredEvents.length === 0" class="home-landing__events-empty">
              {{ $t("home.no_events") }}
            </div>
            <Carousel
              v-else
              :value="filteredEvents"
              :numVisible="2"
              :numScroll="1"
              :responsiveOptions="[
                { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
                { breakpoint: '768px', numVisible: 1, numScroll: 1 },
              ]"
            >
              <template #item="{ data }">
                <EventCard :event="data" />
              </template>
            </Carousel>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Content -->
    <section class="home-landing__section home-landing__section--grey">
      <div class="home-landing__container">
        <div class="home-landing__section-header">
          <h2 class="home-landing__section-title">{{ $t("home.video_content") }}</h2>
          <a href="https://www.youtube.com/channel/UCmuuTTBkfi8aUgUc56VY8kA" target="_blank" class="home-landing__see-all">
            {{ $t("home.see_all_videos") }} <i class="pi pi-arrow-right" />
          </a>
        </div>
        <Skeleton v-if="videosLoading" height="12rem" />
        <Carousel v-else :value="videos" :numVisible="4" :numScroll="1"
          :responsiveOptions="videoCarouselOptions" :autoplayInterval="5000" circular>
          <template #item="{ data }">
            <div class="mx-2"><VideoBlock :video="data" /></div>
          </template>
        </Carousel>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-landing__footer">
      <div class="home-landing__container">
        <div class="home-landing__footer-grid">
          <div class="home-landing__footer-brand">
            <img src="https://2b39-109-175-215-60.ngrok-free.app/images/logo_vertical.png" alt="SDU Library" class="home-landing__footer-logo" />
            <p class="home-landing__footer-tagline">SDU Scientific Library</p>
          </div>
          <div class="home-landing__footer-contacts">
            <h4>{{ $t("home.contacts") }}</h4>
            <p><i class="pi pi-map-marker" /> {{ $t("home.library_address") }}</p>
            <p><i class="pi pi-phone" /> {{ $t("home.library_phone") }}</p>
            <p><i class="pi pi-envelope" /> {{ $t("home.library_email") }}</p>
          </div>
          <div class="home-landing__footer-social">
            <h4>{{ $t("home.follow_us") }}</h4>
            <div class="home-landing__social-links">
              <a href="https://t.me/sdulibrary" target="_blank" class="home-landing__social-btn"><i class="pi pi-telegram" /></a>
              <a href="https://www.instagram.com/sdu.library" target="_blank" class="home-landing__social-btn"><i class="pi pi-instagram" /></a>
              <a href="https://www.youtube.com/channel/UCmuuTTBkfi8aUgUc56VY8kA" target="_blank" class="home-landing__social-btn"><i class="pi pi-youtube" /></a>
            </div>
          </div>
        </div>
        <div class="home-landing__footer-bottom">
          <span>{{ $t("home.all_rights") }} {{ new Date().getFullYear() }}</span>
        </div>
      </div>
    </footer>

    <LoginDialog />
  </div>
</template>
