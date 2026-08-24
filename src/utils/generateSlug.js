/**
 * Generate a URL-friendly slug from text.
 * @param {string} value
 */
export function generateSlug(value) {
  if (!value) return "";

  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
