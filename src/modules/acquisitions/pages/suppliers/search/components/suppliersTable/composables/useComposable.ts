import type { Supplier } from "@/api/acquisitions/suppliers/get/types";
import type { TableColumnDef } from "@/application/types/table";

export function useSuppliersTable() {
  const columns: TableColumnDef<Supplier>[] = [
    { name: "acquisitions.supplier.id", link: "id" },
    { name: "acquisitions.supplier.name", link: "name" },
    { name: "acquisitions.supplier.com_name", link: "com_name" },
    { name: "acquisitions.supplier.bin", link: "bin" },
    { name: "acquisitions.supplier.address", link: "address" },
    { name: "acquisitions.supplier.email", link: "email" },
    { name: "acquisitions.supplier.phone", link: "phone" },
    { name: "acquisitions.supplier.fax", link: "fax" },
  ];

  return { columns };
}