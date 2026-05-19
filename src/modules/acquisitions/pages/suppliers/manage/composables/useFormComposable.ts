import { reactive } from "vue";
import type { SupplierCreateRequest } from "@/api/acquisitions/suppliers/post/types";
import type { SupplierUpdateRequest } from "@/api/acquisitions/suppliers/[id]/patch/types";

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