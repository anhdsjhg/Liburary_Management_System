import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { MediaSearchItem } from "@/api/media/search/get/types";
import { RouteNames } from "@/application/router/routeNames";

interface XmlField {
  id: string;
  data: string | null;
  pid?: string;
  field_code?: string;
}

interface BookDetailResponse {
  res: MediaSearchItem & {
    description?: string;
    content?: string;
    subject_terms?: string[];
    general: Array<{ key: string; value: string }>;
    physical: Array<{ key: string; value: string }>;
  };
  xmlInfo: XmlField[];
}

export function useBookDetail() {
  const route = useRoute();
  const router = useRouter();

  const id = computed(() => Number(route.params.id));

  const { data, isLoading } = useQuery<BookDetailResponse>({
    queryKey: ["get:book-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`media/show/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });

  const book = computed(() => data.value?.res ?? null);
  const xmlInfo = computed(() => data.value?.xmlInfo ?? []);

  function getFromXml(code: string): string {
    return (
      xmlInfo.value
        .filter((f) => f.id === code && f.data)
        .map((f) => f.data)
        .join(", ") ?? ""
    );
  }

  const description = computed(() => {
    const a = getFromXml("520.a");
    const b = getFromXml("520.b");
    return [a, b].filter(Boolean).join("<br>");
  });

  const content = computed(() => getFromXml("505.a"));
  const subjectTerms = computed(() => {
    const terms650a = xmlInfo.value
      .filter((f) => f.id === "650.a" && f.data)
      .map((f) => f.data as string);
    const terms650x = xmlInfo.value
      .filter((f) => f.id === "650.x" && f.data)
      .map((f) => f.data as string);
    return [...new Set([...terms650a, ...terms650x])];
  });

  function searchByAuthor(author: string) {
    router.push({
      name: RouteNames.WEBSITE_SEARCH,
      query: { q: author.trim(), key: "author" },
    });
  }

  function searchByTerm(term: string) {
    router.push({
      name: RouteNames.WEBSITE_SEARCH,
      query: { q: term, key: "all" },
    });
  }

  function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch(() => {
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
  }

  function printPage() {
    const routeData = router.resolve({
      name: RouteNames.WEBSITE_BOOK,
      params: { id: id.value },
      query: { mode: "print" },
    });
    window.open(routeData.href, "_blank");
  }

  return {
    id,
    book,
    isLoading,
    description,
    content,
    subjectTerms,
    searchByAuthor,
    searchByTerm,
    copyLink,
    printPage,
  };
}