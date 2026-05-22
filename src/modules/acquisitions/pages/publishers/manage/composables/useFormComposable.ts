import { reactive } from "vue";
import type { PublisherCreateRequest } from "@/api/acquisitions/publishers/post/types";
import { publisherCreateSchema } from "@/api/acquisitions/publishers/post/types";
import type { PublisherUpdateRequest } from "@/api/acquisitions/publishers/[id]/patch/types";
import type { AppFormConfig } from "@/application/components/AppForm/types/appForm";

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

export function buildPublisherFormConfig(): AppFormConfig<PublisherForm> {
  return {
    schema: publisherCreateSchema,
    submitLabel: "acquisitions.save",
    cancelLabel: "acquisitions.cancel",
    fields: [
      { key: "pub_name", label: "acquisitions.publisher.name", type: "text", required: true, cols: 6 },
      { key: "com_name", label: "acquisitions.publisher.com_name", type: "text", cols: 6 },
      { key: "phone", label: "acquisitions.publisher.phone", type: "text", cols: 4 },
      { key: "email", label: "acquisitions.publisher.email", type: "email", cols: 4 },
      { key: "fax", label: "acquisitions.publisher.fax", type: "text", cols: 4 },
      { key: "address", label: "acquisitions.publisher.address", type: "textarea", cols: 12 },
    ],
  };
}