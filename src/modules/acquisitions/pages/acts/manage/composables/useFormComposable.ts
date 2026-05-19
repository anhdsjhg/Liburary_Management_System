import { reactive } from "vue";
import type { ActCreateRequest } from "@/api/acquisitions/acts/post/types";
import type { ActUpdateRequest } from "@/api/acquisitions/acts/[id]/patch/types";

export interface ActForm {
  act_date: string;
  protocol_id: string;
  protocol_date: string;
  notes: string;
  custom_id: number | null;
}

export function useActForm() {
  const form = reactive<ActForm>({
    act_date: "",
    protocol_id: "",
    protocol_date: "",
    notes: "",
    custom_id: null,
  });

  function toCreateRequest(): ActCreateRequest {
    return {
      act_date: form.act_date,
      protocol_id: form.protocol_id || undefined,
      protocol_date: form.protocol_date || undefined,
      notes: form.notes || undefined,
      custom_id: form.custom_id ?? undefined,
    };
  }

  function toUpdateRequest(act_id: number | string): ActUpdateRequest {
    return {
      act_id,
      act_date: form.act_date || undefined,
      protocol_id: form.protocol_id || undefined,
      protocol_date: form.protocol_date || undefined,
      notes: form.notes || undefined,
    };
  }

  function fillFromExisting(data: Partial<ActForm>) {
    Object.assign(form, data);
  }

  function reset() {
    Object.assign(form, {
      act_date: "",
      protocol_id: "",
      protocol_date: "",
      notes: "",
      custom_id: null,
    });
  }

  return { form, toCreateRequest, toUpdateRequest, fillFromExisting, reset };
}