import { reactive } from "vue";
import type { Ref } from "vue";
import type { ItemCreateRequest } from "@/api/acquisitions/items/post/types";
import type { ItemUpdateRequest } from "@/api/acquisitions/items/[id]/patch/types";
import type { AppFormConfig } from "@/application/components/AppForm/types/appForm";

export interface ItemForm {
  title: string;
  author: string;
  isbn: string;
  issn: string;
  volume: string;
  item_type: string;
  batch_id: number | null;
  publisher_id: number | null;
  count: number | null;
  cost: number | null;
  currency: string;
  location: string;
  pub_year: number | null;
  pub_city: string;
  pps: string;
  prog_code: string;
  status: number | null;
  act_type: string;
  act_no: string;
  issue_name: string;
  issue_num: string;
  issue_date: string;
  custom_inv_id: string;
}

export function useItemForm() {
  const form = reactive<ItemForm>({
    title: "",
    author: "",
    isbn: "",
    issn: "",
    volume: "",
    item_type: "",
    batch_id: null,
    publisher_id: null,
    count: null,
    cost: null,
    currency: "",
    location: "",
    pub_year: null,
    pub_city: "",
    pps: "",
    prog_code: "",
    status: null,
    act_type: "",
    act_no: "",
    issue_name: "",
    issue_num: "",
    issue_date: "",
    custom_inv_id: "",
  });

  function toCreateRequest(): ItemCreateRequest {
    return {
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      issn: form.issn || undefined,
      volume: form.volume || undefined,
      item_type: form.item_type,
      batch_id: form.batch_id ?? 0,
      publisher_id: form.publisher_id ?? 0,
      count: form.count ?? 0,
      cost: form.cost ?? 0,
      currency: form.currency,
      location: form.location,
      pub_year: form.pub_year ?? 0,
      pub_city: form.pub_city,
      pps: form.pps,
      prog_code: form.prog_code ? [form.prog_code] : [],
      status: form.status ?? 0,
      act_type: form.act_type || undefined,
      act_no: form.act_no || undefined,
      issue_name: form.issue_name || undefined,
      issue_num: form.issue_num || undefined,
      issue_date: form.issue_date || undefined,
      custom_inv_id: form.custom_inv_id || undefined,
    };
  }

  function toUpdateRequest(inv_id: number | string): ItemUpdateRequest {
    return {
      inv_id,
      j_issue_id: null,
      batch_id: form.batch_id ?? 0,
      cost: form.cost ?? 0,
      currency: form.currency,
      prog_code: form.prog_code ? [form.prog_code] : [],
      location: form.location,
      pps: form.pps,
      status: form.status ?? 0,
      count: form.count ?? 0,
      author: form.author,
      act_type: form.act_type || undefined,
      act_no: form.act_no || undefined,
      issue_name: form.issue_name,
      issue_num: form.issue_num,
      issue_date: form.issue_date,
    };
  }

  function fillFromExisting(data: Partial<ItemForm>) {
    Object.assign(form, data);
  }

  return { form, toCreateRequest, toUpdateRequest, fillFromExisting };
}

const itemTypeOptions = [
  { label: "Book", value: "BK" },
  { label: "Serial", value: "SR" },
  { label: "Map", value: "MP" },
  { label: "Electronic", value: "EL" },
  { label: "Other", value: "OT" },
];

const currencyOptions = [
  { label: "KZT", value: "KZT" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "RUB", value: "RUB" },
];

const statusOptions = [
  { label: "Active", value: 1 },
  { label: "Inactive", value: 0 },
];

export function buildItemFormConfig(
  isEdit: Ref<boolean>,
  publishers: Ref<{ id: string; name: string }[]>
): AppFormConfig<ItemForm> {
  return {
    submitLabel: "acquisitions.save",
    cancelLabel: "acquisitions.cancel",
    fields: [
      { key: "title", label: "acquisitions.item.title", type: "text", required: true, hide: isEdit.value, cols: 6 },
      { key: "author", label: "acquisitions.item.author", type: "text", required: true, cols: 6 },
      { key: "isbn", label: "acquisitions.item.isbn", type: "text", required: true, hide: isEdit.value, cols: 4 },
      { key: "issn", label: "ISSN", type: "text", hide: isEdit.value, cols: 4 },
      { key: "volume", label: "Volume", type: "text", hide: isEdit.value, cols: 4 },
      { key: "item_type", label: "acquisitions.item.item_type", type: "select", options: itemTypeOptions, required: true, cols: 4 },
      { key: "batch_id", label: "acquisitions.item.batch_id", type: "number", required: true, cols: 4 },
      { key: "publisher_id", label: "acquisitions.item.publisher", type: "select", options: () => publishers.value.map(p => ({ label: p.name, value: p.id })), required: true, hide: isEdit.value, cols: 4 },
      { key: "count", label: "Count", type: "number", required: true, cols: 4 },
      { key: "cost", label: "acquisitions.item.cost", type: "number", required: true, cols: 4 },
      { key: "currency", label: "acquisitions.item.currency", type: "select", options: currencyOptions, required: true, cols: 4 },
      { key: "location", label: "acquisitions.item.location_title", type: "text", required: true, cols: 4 },
      { key: "pub_year", label: "acquisitions.item.pub_year", type: "number", required: true, hide: isEdit.value, cols: 4 },
      { key: "pub_city", label: "Pub. City", type: "text", required: true, hide: isEdit.value, cols: 4 },
      { key: "pps", label: "PPS", type: "text", required: true, cols: 4 },
      { key: "prog_code", label: "Program Code", type: "text", required: true, cols: 4 },
      { key: "status", label: "Status", type: "select", options: statusOptions, required: true, cols: 4 },
      { key: "act_type", label: "Act Type", type: "text", cols: 4 },
      { key: "act_no", label: "acquisitions.item.act_no", type: "text", cols: 4 },
      { key: "issue_name", label: "Issue Name", type: "text", cols: 4 },
      { key: "issue_num", label: "Issue №", type: "text", cols: 4 },
      { key: "issue_date", label: "Issue Date", type: "text", nativeProps: { type: "date" }, cols: 4 },
      { key: "custom_inv_id", label: "Custom Inv. ID", type: "text", hide: isEdit.value, cols: 4 },
    ],
  };
}
