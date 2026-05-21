import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/application/stores/auth.store";
import { useUserMyBooksApi } from "@/api/user/my-books/get";
import { useUserReserveListApi } from "@/api/user/reserve-list/get";

export function useMyBooks() {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  const isAuthenticated = computed(() => !!user.value);

  const { data: myBooksData, isLoading: loansLoading } =
    useUserMyBooksApi(isAuthenticated);

  const { data: reservesData, isLoading: reservesLoading } =
    useUserReserveListApi(isAuthenticated);

  const loans = computed(() => myBooksData.value?.history ?? []);
  const activeLoans = computed(() => myBooksData.value?.return ?? []);
  const reserves = computed(() => reservesData.value ?? []);
  const userInfo = computed(() => myBooksData.value?.info ?? null);
  const total = computed(() => myBooksData.value?.total ?? null);
  const isUnlimited = computed(() => myBooksData.value?.isUnlimited ?? false);
  const photo = computed(() => {
    const raw = myBooksData.value?.photo;
    if (!raw) return null;
    // Backend returns wrong MIME subtype (e.g. data:image/employee;base64,...)
    // Normalise to a valid JPEG data URL
    return raw.replace(/^data:image\/[^;]+;/, "data:image/jpeg;");
  });

  return {
    user,
    loans,
    activeLoans,
    reserves,
    userInfo,
    photo,
    total,
    isUnlimited,
    loansLoading,
    reservesLoading,
  };
}
