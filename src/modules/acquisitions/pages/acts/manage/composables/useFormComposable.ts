import { reactive } from "vue";
import type { Ref } from "vue";
import type { ActCreateRequest } from "@/api/acquisitions/acts/post/types";
import { actCreateSchema } from "@/api/acquisitions/acts/post/types";
import type { ActUpdateRequest } from "@/api/acquisitions/acts/[id]/patch/types";
import type { AppFormConfig } from "@/application/components/AppForm/types/appForm";

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
      protocol_id: form.protocol_id || "",
      protocol_date: form.protocol_date || "",
      notes: form.notes || "",
      custom_id: form.custom_id ?? undefined,
    };
  }

  function toUpdateRequest(act_id: number | string): ActUpdateRequest {
    return {
      act_id,
      act_date: form.act_date || "",
      protocol_id: form.protocol_id || "",
      protocol_date: form.protocol_date || "",
      notes: form.notes || "",
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

export function buildActFormConfig(isEdit: Ref<boolean>): AppFormConfig<ActForm> {
  return {
    schema: actCreateSchema,
    submitLabel: "acquisitions.save",
    cancelLabel: "acquisitions.cancel",
    fields: [
      { key: "act_date", label: "acquisitions.act.act_date", type: "text", nativeProps: { type: "date" }, required: true, cols: 4 },
      { key: "protocol_id", label: "acquisitions.act.protocol_id", type: "text", cols: 4 },
      { key: "protocol_date", label: "acquisitions.act.protocol_date", type: "text", nativeProps: { type: "date" }, cols: 4 },
      { key: "notes", label: "acquisitions.act.notes", type: "textarea", cols: 12 },
      { key: "custom_id", label: "acquisitions.act.id", type: "number", hide: isEdit.value, cols: 4 },
    ],
  };
}