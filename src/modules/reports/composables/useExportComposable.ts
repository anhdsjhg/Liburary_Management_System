import { useI18n } from "vue-i18n";
import { showSuccessToast, showErrorToast } from "@/application/services/toastService";
import axiosInstance from "@/application/configs/axios";

export function useExportComposable() {
  const { t } = useI18n();

  async function exportXlsx(endpoint: string, data: Record<string, unknown>, filename = "report.xlsx") {
    try {
      const res = await axiosInstance.post(endpoint, data, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      showSuccessToast(t("reports.export"));
    } catch {
      showErrorToast(t("reports.export"));
    }
  }

  async function exportPdf(endpoint: string, data: Record<string, unknown>) {
    try {
      const res = await axiosInstance.post(endpoint, data, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank");
      showSuccessToast(t("reports.print"));
    } catch {
      showErrorToast(t("reports.print"));
    }
  }

  async function exportGet(endpoint: string, params: Record<string, unknown>, filename = "report.xlsx") {
    try {
      const res = await axiosInstance.get(endpoint, {
        params,
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      showErrorToast(t("reports.export"));
    }
  }

  return { exportXlsx, exportPdf, exportGet };
}