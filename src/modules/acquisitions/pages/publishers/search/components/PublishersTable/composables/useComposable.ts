import type { Publisher } from "@/api/acquisitions/publishers/get/types";
import type { TableColumnDef } from "@/application/types/table";

export function usePublishersTable() {
  const columns: TableColumnDef<Publisher>[] = [
    { name: "acquisitions.publisher.id", link: "id" },
    { name: "acquisitions.publisher.name", link: "name" },
    { name: "acquisitions.publisher.com_name", link: "com_name" },
    { name: "acquisitions.publisher.address", link: "address" },
    { name: "acquisitions.publisher.email", link: "email" },
    { name: "acquisitions.publisher.phone", link: "phone" },
    { name: "acquisitions.publisher.fax", link: "fax" },
  ];

  return { columns };
}