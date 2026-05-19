export type DateFormat = "DD-MM-YYYY" | "YYYY-MM-DD" | "DD.MM.YYYY" | "MMMM D, YYYY";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseDate(date: Date | string | null | undefined): Date | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return isNaN(d.getTime()) ? null : d;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Formats a date into different readable formats.
 * Returns undefined on null/invalid input — never throws.
 *
 * @example
 * formatDate("2025-01-15", "DD.MM.YYYY")  // "15.01.2025"
 * formatDate("2025-01-15", "YYYY-MM-DD")  // "2025-01-15"
 * formatDate(null)                         // undefined
 */
export function formatDate(
  date?: Date | string | null,
  format: DateFormat = "DD-MM-YYYY"
): string | undefined {
  const d = parseDate(date);
  if (!d) return undefined;

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD.MM.YYYY":
      return `${day}.${month}.${year}`;
    case "MMMM D, YYYY":
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    default:
      return `${day}-${month}-${year}`;
  }
}

/**
 * Formats a date to "YYYY-MM-DD" — the format required by <input type="date">.
 * Replaces legacy Date.prototype.toDateInputValue().
 *
 * @example
 * toDateInput("2025-01-15T10:00:00Z")  // "2025-01-15"
 * toDateInput(null)                     // ""
 */
export function toDateInput(date?: Date | string | null): string {
  return formatDate(date, "YYYY-MM-DD") ?? "";
}

/**
 * Formats a time or datetime string to 24-hour "HH:mm" format.
 * Returns undefined on invalid input.
 *
 * @example
 * formatTime("2025-01-15T15:42:11.192Z")  // "15:42"
 * formatTime("15:42:11")                   // "15:42"
 */
export function formatTime(time?: Date | string | null): string | undefined {
  const d = parseDate(time);
  if (!d) return undefined;
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Formats a datetime to "DD-MM-YYYY -- HH:mm".
 *
 * @example
 * formatDateTime("2025-01-15T15:42:11Z")  // "15-01-2025 -- 15:42"
 */
export function formatDateTime(datetime?: Date | string | null): string | undefined {
  const d = parseDate(datetime);
  if (!d) return undefined;
  const date = formatDate(d, "DD-MM-YYYY");
  const time = formatTime(d);
  if (!date || !time) return undefined;
  return `${date} -- ${time}`;
}

/**
 * Formats a UTC ISO string using a custom format pattern.
 * Supported tokens: YYYY MM DD HH mm ss
 *
 * @example
 * formatDateUTC("2025-01-15T15:42:11.192Z", "DD.MM.YYYY HH:mm")  // "15.01.2025 15:42"
 */
export function formatDateUTC(iso: string, format = "YYYY-MM-DD HH:mm:ss"): string {
  const d = parseDate(iso);
  if (!d) return "";

  const map: Record<string, string> = {
    YYYY: String(d.getUTCFullYear()),
    MM: pad(d.getUTCMonth() + 1),
    DD: pad(d.getUTCDate()),
    HH: pad(d.getUTCHours()),
    mm: pad(d.getUTCMinutes()),
    ss: pad(d.getUTCSeconds()),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => map[token] ?? token);
}

/**
 * Builds a timestamp filename suffix: "name_YYYY.MM.DD_HH.mm.ext"
 * Matches legacy download_file mixin filename pattern.
 *
 * @example
 * buildTimestampFilename("acts", "xlsx")  // "acts_2025.01.15_14.30.xlsx"
 */
export function buildTimestampFilename(name: string, ext: string): string {
  const now = new Date();
  const date = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}.${pad(now.getMinutes())}`;
  return `${name}_${date}_${time}.${ext}`;
}

/**
 * Returns number of days between two dates. Positive = future.
 *
 * @example
 * daysDiff(new Date(), new Date("2025-12-31"))  // days until end of year
 */
export function daysDiff(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}