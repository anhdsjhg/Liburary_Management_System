export type DownloadExtension = "xlsx" | "pdf" | "xml" | "txt" | "csv";

function buildFilename(name: string, extension: DownloadExtension | string): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}.${pad(now.getMinutes())}`;
  return `${name}_${date}_${time}.${extension}`;
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

function download(blob: Blob, name: string, extension: DownloadExtension | string): void {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, buildFilename(name, extension));
}

function downloadAs(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
}

function printBlob(blob: Blob): void {
  const url = URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" })
  );
  const win = window.open(url);
  if (win) {
    win.onload = () => win.print();
  }
}

function downloadText(content: string, filename = "barcodes.txt"): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
}

export const downloadService = {
  download,
  downloadAs,
  printBlob,
  downloadText,
} as const;