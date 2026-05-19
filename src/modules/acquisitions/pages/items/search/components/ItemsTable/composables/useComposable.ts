import type { AcquisitionItem } from "@/api/acquisitions/items/get/types";
import type { TableColumnDef } from "@/application/types/table";

export function useItemsTable() {
  const columns: TableColumnDef<AcquisitionItem>[] = [
    { name: "acquisitions.item.id", link: "id" },
    { name: "acquisitions.item.barcode", link: "barcode" },
    { name: "acquisitions.item.title", link: "title" },
    { name: "acquisitions.item.author", link: "author" },
    { name: "acquisitions.item.isbn", link: "isbn" },
    { name: "acquisitions.item.pub_year", link: "pub_year" },
    { name: "acquisitions.item.item_type", link: "item_type" },
    { name: "acquisitions.item.publisher", link: "publisher" },
    { name: "acquisitions.item.supplier", link: "supplier" },
    { name: "acquisitions.item.cost", link: "cost" },
    { name: "acquisitions.item.currency", link: "currency" },
    { name: "acquisitions.item.location_title", link: "location_title" },
    { name: "acquisitions.item.create_date", link: "create_date", is_date: true },
    { name: "acquisitions.item.batch_id", link: "batch_id" },
    { name: "acquisitions.item.act_no", link: "act_no" },
  ];

  return { columns };
}