/**
 * Serialize a Mongoose lean document (or array) for Client Components.
 * Converts ObjectIds/Dates (and nested ones) into plain JSON values.
 */
export function serializePackage(pkg) {
  if (pkg == null) return null
  return JSON.parse(JSON.stringify(pkg))
}
