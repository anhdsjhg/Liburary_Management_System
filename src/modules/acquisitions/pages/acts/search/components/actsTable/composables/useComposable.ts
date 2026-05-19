import type { Act } from "@/api/acquisitions/acts/get/types";
import type { TableColumnDef } from "@/application/types/table";

export function useActsTable() {
  const columns: TableColumnDef<Act>[] = [
    { name: "acquisitions.act.id", link: "id" },
    { name: "acquisitions.act.act_date", link: "act_date", is_date: true },
    { name: "acquisitions.act.status", link: "status" },
    { name: "acquisitions.act.protocol_id", link: "protocol_id" },
    { name: "acquisitions.act.protocol_date", link: "protocol_date", is_date: true },
    { name: "acquisitions.act.items_ma", link: "items_ma" },
    { name: "acquisitions.act.price", link: "price" },
    { name: "acquisitions.act.currency", link: "currency" },
    { name: "acquisitions.act.create_date", link: "create_date", is_date: true },
    { name: "acquisitions.act.notes", link: "notes" },
  ];

  return { columns };
}