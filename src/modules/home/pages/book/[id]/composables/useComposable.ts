import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import axiosInstance from "@/application/configs/axios";
import type { MediaSearchItem } from "@/api/media/search/get/types";
import { RouteNames } from "@/application/router/routeNames";
import { useI18n } from "vue-i18n";

interface XmlField {
  id: string;
  data: string | null;
  pid?: string | null;
  field_code?: string;
  title?: string;
}

interface BookDetailResponse {
  res: MediaSearchItem & {
    city?: string | null;
    publisher?: string | null;
    isbn?: string | null;
    issn?: string | null;
    volume?: string | null;
    language_title?: string | null;
  };
  xmlInfo: XmlField[];
}

export interface DetailRow {
  key: string;
  value: string | null;
}

export function useBookDetail() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const id = computed(() => Number(route.params.id));

  const { data, isLoading } = useQuery<BookDetailResponse>({
    queryKey: ["get:book-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`media/show/${id.value}`);
      return res.data;
    },
    enabled: () => !!id.value,
  });

  const book = computed(() => {
    const res = data.value?.res;
    if (!res || Array.isArray(res)) return null;
    return res;
  });
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
    const a = xmlInfo.value
      .filter((f) => f.id === "650.a" && f.data)
      .map((f) => f.data as string);
    const x = xmlInfo.value
      .filter((f) => f.id === "650.x" && f.data)
      .map((f) => f.data as string);
    return [...new Set([...a, ...x])];
  });

  // General details — combines res fields + xml
  const generalDetails = computed<DetailRow[]>(() => {
    const b = book.value;
    if (!b) return [];

    const publisher = [b.city, b.publisher].filter(Boolean).join(", ");
    const language = getFromXml("546.a") || b.language_title || b.language || null;

    return [
      { key: "home.title", value: b.title ?? null },
      { key: "home.title_reminder", value: getFromXml("245.b") || null },
      { key: "home.attribution", value: getFromXml("245.c") || null },
      { key: "home.author", value: b.author ?? null },
      { key: "home.isbn", value: b.isbn ?? null },
      { key: "home.year", value: b.year != null ? String(b.year) : null },
      { key: "home.publisher", value: publisher || null },
      { key: "home.series", value: getFromXml("490.a") || null },
      { key: "home.volume", value: getFromXml("490.v") || (b.volume != null ? String(b.volume) : null) },
      { key: "home.edition", value: getFromXml("250.a") || null },
      { key: "home.notes", value: getFromXml("504.a") || null },
      { key: "home.genre", value: b.genre ?? null },
      { key: "home.call_number", value: b.call_number ?? null },
      { key: "home.language", value: language },
      { key: "home.type", value: b.type ?? null },
    ].filter((row) => row.value) as DetailRow[];
  });

  // Physical details from XML 300.*
  const physicalDetails = computed<DetailRow[]>(() => {
    return [
      { key: "home.page_number", value: getFromXml("300.a") || null },
      { key: "home.other", value: getFromXml("300.b") || null },
      { key: "home.dimensions", value: getFromXml("300.c") || null },
      { key: "home.accompany", value: getFromXml("300.e") || null },
    ].filter((row) => row.value);
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
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        alert("Copied: " + url);
      });
    } else {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      try {
        document.execCommand("copy");
        alert("Copied: " + url);
      } catch {
        alert("Copy failed, URL: " + url);
      }
      document.body.removeChild(el);
    }
  }

  function printPage() {
    window.print();
  }

  return {
    id,
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
  };
}
