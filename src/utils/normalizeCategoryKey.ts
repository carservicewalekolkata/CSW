export const normalizeCategoryKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, ' & ')
    .replace(/\s+/g, ' ')
    .trim();
