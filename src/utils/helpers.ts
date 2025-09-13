// src/utils/helper.ts
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const truncate = (str: string, maxLength = 100): string =>
  str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

export const titleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");

export const isBrowser = (): boolean => typeof window !== "undefined";
// Placeholder for helpers.ts
