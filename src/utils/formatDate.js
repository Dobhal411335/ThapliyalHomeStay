import dayjs from "dayjs";

/**
 * Format a date value using dayjs.
 * @param {Date|string|number} value
 * @param {string} [format="MMMM D, YYYY"]
 */
export function formatDate(value, format = "MMMM D, YYYY") {
  if (!value) return "";
  return dayjs(value).format(format);
}
