import { reactive } from "vue";
import type { Ref } from "vue";
import type { BatchCreateRequest } from "@/api/acquisitions/batches/post/types";
import { batchCreateSchema } from "@/api/acquisitions/batches/post/types";
import type { BatchUpdateRequest } from "@/api/acquisitions/batches/[id]/patch/types";
import type { AppFormConfig } from "@/application/components/AppForm/types/appForm";

export interface BatchForm {
  invoice_date: string;
  items_no: number | null;
  titles_no: number | null;
  doc_no: string;
  sup_type: string;
  sup_id: number | null;
  contract_no: string;
  invoice_details: string;
  cost: number | null;
  custom_id: number | null;
}

export function useBatchForm() {
  const form = reactive<BatchForm>({
    invoice_date: "",
    items_no: null,
    titles_no: null,
    doc_no: "",
    sup_type: "",
    sup_id: null,
    contract_no: "",
    invoice_details: "",
    cost: null,
    custom_id: null,
  });

  function toCreateRequest(): BatchCreateRequest {
    return {
      invoice_date: form.invoice_date,
      items_no: form.items_no ?? undefined,
      titles_no: form.titles_no ?? undefined,
      doc_no: form.doc_no || undefined,
      sup_type: form.sup_type || undefined,
      sup_id: form.sup_id ?? undefined,
      contract_no: form.contract_no || undefined,
      invoice_details: form.invoice_details || undefined,
      cost: form.cost ?? undefined,
      custom_id: form.custom_id ?? undefined,
    };
  }

  function toUpdateRequest(batch_id: number | string): BatchUpdateRequest {
    return {
      batch_id,
      invoice_date: form.invoice_date || "",
      items_no: form.items_no,
      titles_no: form.titles_no,
      doc_no: form.doc_no || "",
      sup_type: form.sup_type || "",
      sup_id: form.sup_id,
      contract_no: form.contract_no || "",
      invoice_details: form.invoice_details || "",
      cost: form.cost,
    };
  }

  function fillFromExisting(data: Partial<BatchForm>) {
    Object.assign(form, data);
  }

  function reset() {
    Object.assign(form, {
      invoice_date: "",
      items_no: null,
      titles_no: null,
      doc_no: "",
      sup_type: "",
      sup_id: null,
      contract_no: "",
      invoice_details: "",
      cost: null,
      custom_id: null,
    });
  }

  return { form, toCreateRequest, toUpdateRequest, fillFromExisting, reset };
}

const supTypeOptions = [
  { label: "Donated", value: "D" },
  { label: "Bought", value: "B" },
  { label: "Replacement", value: "R" },
];

export function buildBatchFormConfig(
  isEdit: Ref<boolean>,
  suppliers: Ref<{ id: number; name: string }[]>
): AppFormConfig<BatchForm> {
  return {
    schema: batchCreateSchema,
    submitLabel: "acquisitions.save",
    cancelLabel: "acquisitions.cancel",
    fields: [
      { key: "invoice_date", label: "acquisitions.batch.invoice_date", type: "text", nativeProps: { type: "date" }, required: true, cols: 4 },
      { key: "doc_no", label: "acquisitions.batch.doc_no", type: "text", required: true, cols: 4 },
      { key: "contract_no", label: "acquisitions.batch.contract_no", type: "text", cols: 4 },
      { key: "cost", label: "acquisitions.batch.cost", type: "number", required: true, cols: 4 },
      { key: "titles_no", label: "acquisitions.batch.titles_no", type: "number", required: true, cols: 4 },
      { key: "items_no", label: "acquisitions.batch.items_no", type: "number", required: true, cols: 4 },
      { key: "sup_type", label: "acquisitions.batch.sup_type", type: "select", options: supTypeOptions, cols: 4 },
      { key: "sup_id", label: "acquisitions.batch.supplier", type: "select", options: () => suppliers.value.map(s => ({ label: s.name, value: s.id })), cols: 4 },
      { key: "invoice_details", label: "acquisitions.batch.invoice_details", type: "textarea", cols: 12 },
      { key: "custom_id", label: "acquisitions.batch.id", type: "number", hide: isEdit.value, cols: 4 },
    ],
  };
}
