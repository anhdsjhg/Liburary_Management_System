import { useI18n } from "vue-i18n";
import type { CatalogingMaterial } from "@/api/cataloging/search/get/types";
import type { TableColumnDef } from "@/application/types/table";

export function useCatalogingResultsTable() {
  const { t } = useI18n();

  const columns: TableColumnDef<CatalogingMaterial>[] = [
    { name: "cataloging.call_number", link: "call_number" },
    { name: "cataloging.type", link: "type" },
    { name: "cataloging.title", link: "title" },
    { name: "cataloging.author", link: "author" },
    { name: "cataloging.isbn", link: "isbn" },
    { name: "cataloging.language", link: "language" },
    { name: "cataloging.genre", link: "genre" },
    {
      name: "cataloging.state.label",
      link: "state",
      display_func: (row) => {
        const map: Record<string, string> = {
          not_started: t("cataloging.state.not_started"),
          in_progress: t("cataloging.state.in_progress"),
          completed: t("cataloging.state.completed"),
        };
        return map[(row.state as string) ?? ""] ?? ((row.state as string) ?? "");
      },
    },
  ];

  return { columns };
}