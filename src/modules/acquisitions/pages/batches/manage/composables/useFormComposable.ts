import { reactive } from "vue";
import type { BatchCreateRequest } from "@/api/acquisitions/batches/post/types";
import type { BatchUpdateRequest } from "@/api/acquisitions/batches/[id]/patch/types";

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
      invoice_date: form.invoice_date || undefined,
      items_no: form.items_no ?? undefined,
      titles_no: form.titles_no ?? undefined,
      doc_no: form.doc_no || undefined,
      sup_type: form.sup_type || undefined,
      sup_id: form.sup_id ?? undefined,
      contract_no: form.contract_no || undefined,
      invoice_details: form.invoice_details || undefined,
      cost: form.cost ?? undefined,
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