import { reactive } from "vue";
import type { SupplierCreateRequest } from "@/api/acquisitions/suppliers/post/types";
import { supplierCreateSchema } from "@/api/acquisitions/suppliers/post/types";
import type { SupplierUpdateRequest } from "@/api/acquisitions/suppliers/[id]/patch/types";
import type { AppFormConfig } from "@/application/components/AppForm/types/appForm";

export interface SupplierForm {
  sup_name: string;
  bin: string;
  com_name: string;
  address: string;
  email: string;
  fax: string;
  phone: string;
}

export function useSupplierForm() {
  const form = reactive<SupplierForm>({
    sup_name: "",
    bin: "",
    com_name: "",
    address: "",
    email: "",
    fax: "",
    phone: "",
  });

  function toCreateRequest(): SupplierCreateRequest {
    return {
      sup_name: form.sup_name,
      bin: form.bin || undefined,
      com_name: form.com_name || undefined,
      address: form.address || undefined,
      email: form.email || undefined,
      fax: form.fax || undefined,
      phone: form.phone || undefined,
    };
  }

  function toUpdateRequest(sup_id: number | string): SupplierUpdateRequest {
    return { sup_id, ...toCreateRequest() };
  }

  function fillFromExisting(data: Partial<SupplierForm>) {
    Object.assign(form, data);
  }

  function reset() {
    Object.assign(form, {
      sup_name: "",
      bin: "",
      com_name: "",
      address: "",
      email: "",
      fax: "",
      phone: "",
    });
  }

  return { form, toCreateRequest, toUpdateRequest, fillFromExisting, reset };
}

export function buildSupplierFormConfig(): AppFormConfig<SupplierForm> {
  return {
    schema: supplierCreateSchema,
    submitLabel: "acquisitions.save",
    cancelLabel: "acquisitions.cancel",
    fields: [
      { key: "sup_name", label: "acquisitions.supplier.name", type: "text", required: true, cols: 6 },
      { key: "com_name", label: "acquisitions.supplier.com_name", type: "text", cols: 6 },
      { key: "bin", label: "acquisitions.supplier.bin", type: "text", cols: 4 },
      { key: "phone", label: "acquisitions.supplier.phone", type: "text", cols: 4 },
      { key: "email", label: "acquisitions.supplier.email", type: "email", cols: 4 },
      { key: "fax", label: "acquisitions.supplier.fax", type: "text", cols: 4 },
      { key: "address", label: "acquisitions.supplier.address", type: "textarea", cols: 12 },
    ],
  };
}