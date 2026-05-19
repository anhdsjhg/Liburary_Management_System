import type { Batch } from "@/api/acquisitions/batches/get/types";
import type { TableColumnDef } from "@/application/types/table";

export function useBatchesTable() {
  const columns: TableColumnDef<Batch>[] = [
    { name: "acquisitions.batch.id", link: "id" },
    { name: "acquisitions.batch.status", link: "status" },
    { name: "acquisitions.batch.invoice_date", link: "invoice_date", is_date: true },
    { name: "acquisitions.batch.sup_type", link: "sup_type" },
    { name: "acquisitions.batch.supplier", link: "supplier" },
    { name: "acquisitions.batch.titles_no", link: "titles_no" },
    { name: "acquisitions.batch.items_no", link: "items_no" },
    { name: "acquisitions.batch.titles_ma", link: "titles_ma" },
    { name: "acquisitions.batch.items_ma", link: "items_ma" },
    { name: "acquisitions.batch.price", link: "price" },
    { name: "acquisitions.batch.currency", link: "currency" },
    { name: "acquisitions.batch.doc_no", link: "doc_no" },
    { name: "acquisitions.batch.create_date", link: "create_date", is_date: true },
    { name: "acquisitions.batch.created_by", link: "created_by" },
  ];

  return { columns };
}