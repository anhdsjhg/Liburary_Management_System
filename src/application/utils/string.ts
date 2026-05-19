export function capitalizeString<T extends string>(str: T): Capitalize<T> {
  if (!str) return str as Capitalize<T>;
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

export function uppercaseString<T extends string>(str: T): Uppercase<T> {
  return str.toUpperCase() as Uppercase<T>;
}

export function safeTrim(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function truncate(str: string, maxLength: number, ellipsis = "…"): string {
  if (!str || str.length <= maxLength) return str ?? "";
  return str.slice(0, maxLength) + ellipsis;
}

export function hasMinLength(
  value: string,
  minLength = 2,
  allowEmpty = false
): boolean {
  const trimmed = value?.replace(/\s/g, "") ?? "";
  if (trimmed.length === 0 && allowEmpty) return true;
  return trimmed.length >= minLength;
}

export function camelToTitle(str: string): string {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^\s+/, "")
    .split(" ")
    .map((w) => capitalizeString(w))
    .join(" ");
}