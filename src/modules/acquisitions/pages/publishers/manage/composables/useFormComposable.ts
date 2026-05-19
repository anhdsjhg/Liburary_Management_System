import { reactive } from "vue";
import type { PublisherCreateRequest } from "@/api/acquisitions/publishers/post/types";
import type { PublisherUpdateRequest } from "@/api/acquisitions/publishers/[id]/patch/types";

export interface PublisherForm {
  pub_name: string;
  com_name: string;
  address: string;
  email: string;
  fax: string;
  phone: string;
}

export function usePublisherForm() {
  const form = reactive<PublisherForm>({
    pub_name: "",
    com_name: "",
    address: "",
    email: "",
    fax: "",
    phone: "",
  });

  function toCreateRequest(): PublisherCreateRequest {
    return {
      pub_name: form.pub_name,
      com_name: form.com_name || undefined,
      address: form.address || undefined,
      email: form.email || undefined,
      fax: form.fax || undefined,
      phone: form.phone || undefined,
    };
  }

  function toUpdateRequest(pub_id: number | string): PublisherUpdateRequest {
    return { pub_id, ...toCreateRequest() };
  }

  function fillFromExisting(data: Partial<PublisherForm>) {
    Object.assign(form, data);
  }

  function reset() {
    Object.assign(form, {
      pub_name: "",
      com_name: "",
      address: "",
      email: "",
      fax: "",
      phone: "",
    });
  }

  return { form, toCreateRequest, toUpdateRequest, fillFromExisting, reset };
}